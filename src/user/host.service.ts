import { Injectable, NotFoundException } from '@nestjs/common';
import { SortOrder } from 'src/enums/sortOrder.enum';
import ErrorsTypes from 'src/errors/errors.enum';
import { GlobalException } from 'src/exceptions/global.exception';
import { PrismaService } from 'src/prisma/prisma.service';
import { HostUser } from './type/HostUser';

@Injectable()
export class HostService {
  constructor(private readonly prismaService: PrismaService) {}

  PAGE_SIZE = 10;

  async getHostUserProfile(id: string) {
    try {
      const user = (
        await this.prismaService.$queryRaw<HostUser[]>`
WITH 
	"userAccommodations" AS (SELECT * FROM "Accommodation" WHERE "ownerId" = ${id}),
	"userReviews" AS (SELECT * FROM "Review" WHERE "accommodationId" IN (SELECT id FROM "userAccommodations"))
SELECT 
	usr.id, usr.email, usr."firstName", usr."lastName", usr."isVerified", usr."isEmailVerified", usr."createdAt", 
	up.language, up.country, up.description, up."imageUrl",
	(SELECT AVG(rating) FROM "userReviews") as "rating",
	(SELECT COUNT(*)::int FROM "userReviews") as "reviewsCount",
	(
	  SELECT json_agg(
	    json_build_object(
	      'id', "id",
	      'title', "title",
	      'previewImgUrl', "previewImgUrl",
	      'rating', (SELECT AVG(rating) FROM "userReviews" WHERE "accommodationId" = usr_acc.id)
	    )
	  )
	  FROM "userAccommodations" usr_acc
	  WHERE  "isDeleted" = false AND "available" = true
	) as "accommodations",
	(
	  SELECT json_agg(reviewRows.review)
	  FROM (
	      SELECT json_build_object(
		      'id', r.id,
		      'accommodationId', r."accommodationId",
		      'feedback', r.feedback,
		      'rating', r.rating,
		      'createdAt', r."createdAt",
		      'user', json_build_object(
		        'id', u.id,
		        'firstName', u."firstName",
		        'lastName', u."lastName",
		        'profile', json_build_object(
              'imageUrl', p."imageUrl"
            )
		      )
		    ) AS review
		  FROM "userReviews" r
		  JOIN "User" u ON u.id = r."userId"
		  JOIN "UserProfile" p ON p."userId" = u.id
		  ORDER BY r."createdAt" DESC
		  LIMIT ${this.PAGE_SIZE}
	  ) AS reviewRows
	) as "reviews"
FROM "User" usr JOIN "UserProfile" up ON usr.id = up."userId"
WHERE usr.id = ${id} AND "isDeleted" = FALSE;`
      )[0];

      if (!user) throw new NotFoundException(ErrorsTypes.NOT_FOUND_HOST_PROFILE);

      return {
        success: true,
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isVerified: user.isVerified,
          isEmailVerified: user.isEmailVerified,
          createdAt: user.createdAt,
          language: user.language,
          country: user.country,
          description: user.description,
          imageUrl: user.imageUrl,
          rating: user.rating,
          accommodations: user.accommodations,
          reviews: {
            count: user.reviewsCount,
            page: 1,
            list: user.reviews,
          },
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new GlobalException(ErrorsTypes.HOST_PROFILE_FAILED_TO_GET, error.message);
    }
  }

  async getHostComments(id: string, page: number) {
    try {
      const reviews = await this.prismaService.review.findMany({
        where: { accommodation: { ownerId: id } },
        select: {
          id: true,
          accommodationId: true,
          feedback: true,
          rating: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profile: {
                select: {
                  imageUrl: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: SortOrder.DESC },
        take: this.PAGE_SIZE,
        skip: this.PAGE_SIZE * (page - 1),
      });

      return {
        success: true,
        data: {
          page,
          list: reviews,
        },
      };
    } catch (error) {
      throw new GlobalException(ErrorsTypes.REVIEWS_FAILED_TO_GET_LIST, error.message);
    }
  }
}
