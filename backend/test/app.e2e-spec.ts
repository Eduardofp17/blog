import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { CreateUserDto } from 'src/auth/dto';
import { MongoDbModule } from '../src/database/mongoose.module';
import { MongooseService } from '../src/database/mongoose.service';
import { CreatePostDto } from 'src/post/dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let mongooseService: MongooseService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, MongoDbModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.setGlobalPrefix('api');
    await app.init();
    await app.listen(3000);
    mongooseService = moduleRef.get<MongooseService>(MongooseService);
    await mongooseService.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3000/api');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const dto: CreateUserDto = {
      email: 'teste@gmail.com',
      username: 'Eduardofp1777',
      name: 'Eduardo',
      lastname: 'Pinheiro',
      password: 'abc123',
    };
    describe('User signup', () => {
      it('Should throw if email field is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            username: dto.username,
            lastname: dto.lastname,
            name: dto.name,
            password: dto.password,
          })
          .expectJsonLike({
            message: ['email must be an email'],
            error: 'Bad Request',
            statusCode: 400,
          })
          .expectStatus(400);
      });
      it('Should throw if email is not valid', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            username: dto.username,
            lastname: dto.lastname,
            name: dto.name,
            password: dto.password,
            email: 'teste',
          })
          .expectJsonLike({
            message: ['email must be an email'],
            error: 'Bad Request',
            statusCode: 400,
          })
          .expectStatus(400);
      });
      it('Should throw if password field is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            username: dto.username,
            lastname: dto.lastname,
            name: dto.name,
            email: dto.email,
          })
          .expectJsonLike({
            message: [
              'password must be a string',
              'password should not be empty',
            ],
            error: 'Bad Request',
            statusCode: 400,
          })
          .expectStatus(400);
      });
      it('Should throw if name has not the minimum value', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            lastname: dto.lastname,
            username: dto.username,
            email: dto.email,
            password: 'oadfa',
            name: dto.name,
          })
          .expectJsonLike({
            message: ['Password must be between 6 and 20 characters'],
            error: 'Bad Request',
            statusCode: 400,
          })
          .expectStatus(400);
      });

      it('Should throw if password exceed the maximum length', () => {
        const password = 'jmokamkodaaabdnfkandnofamnodmfdmaeeeeeeeeeeeeeeeeee';
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            lastname: dto.lastname,
            username: dto.username,
            email: dto.email,
            name: dto.name,
            password,
          })
          .expectJsonLike({
            message: ['Password must be between 6 and 20 characters'],
            error: 'Bad Request',
            statusCode: 400,
          })
          .expectStatus(400);
      });
      it('Should throw if username field is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            lastname: dto.lastname,
            name: dto.name,
            email: dto.email,
            password: dto.password,
          })
          .expectJsonLike({
            message: [
              'username must be a string',
              'username should not be empty',
            ],
            error: 'Bad Request',
            statusCode: 400,
          })
          .expectStatus(400);
      });
      it('Should throw if username is invalid', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            lastname: dto.lastname,
            name: dto.name,
            email: dto.email,
            password: dto.password,
            username: '@adfoa2__----afnap',
          })
          .expectJsonLike({
            message: ['Username must contain only letters and numbers'],
            error: 'Bad Request',
            statusCode: 400,
          })
          .expectStatus(400);
      });
      it('Should throw if username has not the min length', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            lastname: dto.lastname,
            name: dto.name,
            email: dto.email,
            password: dto.password,
            username: 'ad',
          })
          .expectJsonLike({
            message: ['Username must be between 3 and 20 characters'],
            error: 'Bad Request',
            statusCode: 400,
          })
          .expectStatus(400);
      });
      it('Should throw if username exceed max length', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            lastname: dto.lastname,
            name: dto.name,
            email: dto.email,
            password: dto.password,
            username: '2ajpamjrepamwapemnrpampermapw9433094aplrfm',
          })
          .expectJsonLike({
            message: ['Username must be between 3 and 20 characters'],
            error: 'Bad Request',
            statusCode: 400,
          })
          .expectStatus(400);
      });
      it('Should throw if name field is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            lastname: dto.lastname,
            username: dto.username,
            email: dto.email,
            password: dto.password,
          })
          .expectJsonLike({
            message: ['name must be a string', 'name should not be empty'],
            error: 'Bad Request',
            statusCode: 400,
          })
          .expectStatus(400);
      });

      it('Should throw if name has not the minimum value', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            lastname: dto.lastname,
            username: dto.username,
            email: dto.email,
            name: 'o',
            password: dto.password,
          })
          .expectJsonLike({
            message: ['Name must be between 2 and 50 characters'],
            error: 'Bad Request',
            statusCode: 400,
          })
          .expectStatus(400);
      });

      it('Should throw if name exceed the maximum length', () => {
        const name = 'jmokamkodaaabdnfkandnofamnodmfdmaeeeeeeeeeeeeeeeeee';
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            lastname: dto.lastname,
            username: dto.username,
            email: dto.email,
            password: dto.password,
            name,
          })
          .expectJsonLike({
            message: ['Name must be between 2 and 50 characters'],
            error: 'Bad Request',
            statusCode: 400,
          })
          .expectStatus(400);
      });
      it('Should throw if lastname field is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            name: dto.name,
            username: dto.username,
            email: dto.email,
            password: dto.password,
          })
          .expectStatus(400)
          .expectJsonLike({
            message: [
              'lastname must be a string',
              'lastname should not be empty',
            ],
            error: 'Bad Request',
            statusCode: 400,
          });
      });
      it('Should throw if name has not the minimum value', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            name: dto.name,
            username: dto.username,
            email: dto.email,
            lastname: 'o',
            password: dto.password,
          })
          .expectJsonLike({
            message: ['Lastname must be between 2 and 50 characters'],
            error: 'Bad Request',
            statusCode: 400,
          })
          .expectStatus(400);
      });

      it('Should throw if name exceed the maximum length', () => {
        const lastname = 'jmokamkodaaabdnfkandnofamnodmfdmaeeeeeeeeeeeeeeeeee';
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            lastname,
            username: dto.username,
            email: dto.email,
            password: dto.password,
            name: dto.name,
          })
          .expectJsonLike({
            message: ['Lastname must be between 2 and 50 characters'],
            error: 'Bad Request',
            statusCode: 400,
          })
          .expectStatus(400);
      });
      it('Should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            name: dto.name,
            username: dto.username,
            lastname: dto.lastname,
            email: dto.email,
            password: dto.password,
          })
          .expectStatus(201)
          .stores('userId', '_id');
      });
    });
    describe('User Signin', () => {
      it('should throw if username does not exist', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ emailOrUsername: 'hithere', password: dto.password })
          .expectStatus(403)
          .expectJsonLike({
            message: 'Incorrect credentials.',
            error: 'Forbidden',
            statusCode: 403,
          });
      });
      it('should throw if emailOrUsername is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ password: dto.password })
          .expectStatus(400)
          .expectJsonLike({
            message: 'Email/username and password are required.',
            error: 'Bad Request',
            statusCode: 400,
          });
      });
      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ emailOrUsername: 'test@gmail.com' })
          .expectStatus(400)
          .expectJsonLike({
            message: [
              'password must be a string',
              'password should not be empty',
            ],
            error: 'Bad Request',
            statusCode: 400,
          });
      });
      it('Should throw if name has not the minimum value', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: 'oadfa',
            emailOrUsername: dto.email,
          })
          .expectJsonLike({
            message: ['Password must be between 6 and 20 characters'],
            error: 'Bad Request',
            statusCode: 400,
          })
          .expectStatus(400);
      });

      it('Should throw if password exceed the maximum length', () => {
        const password = 'jmokamkodaaabdnfkandnofamnodmfdmaeeeeeeeeeeeeeeeeee';
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            emailOrUsername: dto.email,
            password,
          })
          .expectJsonLike({
            message: ['Password must be between 6 and 20 characters'],
            error: 'Bad Request',
            statusCode: 400,
          })
          .expectStatus(400);
      });
      it('should throw if no body', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });
      it('should throw if email is wrong', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            emailOrUsername: 'teste23@gmail.com',
            password: dto.password,
          })
          .expectStatus(403)
          .expectJsonLike({
            message: 'Incorrect credentials.',
            error: 'Forbidden',
            statusCode: 403,
          });
      });
      it('should throw if password is wrong', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ emailOrUsername: dto.email, password: '123456adfa' })
          .expectStatus(403)
          .expectJsonLike({
            message: 'Incorrect credentials.',
            error: 'Forbidden',
            statusCode: 403,
          });
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ emailOrUsername: dto.email, password: dto.password })
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });
  describe('Create super user to tests', () => {
    it('Should create the Eduardofp user', () => {
      return pactum
        .spec()
        .post('/auth/signup')
        .withBody({
          username: 'Eduardofp',
          name: 'Eduardo',
          lastname: 'Pinheiro',
          email: 'secmmvi@gmail.com',
          password: 'abc123',
        })
        .expectStatus(201)
        .stores('eduardoFpId', '_id');
    });
  });

  describe('User', () => {
    describe('Update User', () => {
      it('Should throw if no bearer', () => {
        return pactum.spec().patch('/users/me').expectStatus(401);
      });
      it('Should update user', () => {
        return pactum
          .spec()
          .patch('/users/me')
          .withBody({ name: 'Name updated' })
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200);
      });
    });
  });

  describe('Post', () => {
    it('Should get an empty array', () => {
      return pactum
        .spec()
        .withHeaders({ Authorization: 'Bearer $S{userAt}' })
        .get('/posts/feed/')
        .expectStatus(200)
        .expectJsonLike([]);
    });
    describe('Create post', () => {
      const dto: CreatePostDto = {
        title: 'Why is Eduardo so rich?',
        content: 'Cause he deserve it sooo much',
      };

      it('should signin with Eduardofp', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            emailOrUsername: 'Eduardofp',
            password: 'abc123',
          })
          .expectStatus(200)
          .stores('eduardoFpToken', 'access_token');
      });
      it('Should throw if no bearer', () => {
        return pactum.spec().post('/posts/').expectStatus(401).expectJsonLike({
          message: 'Unauthorized',
          statusCode: 401,
        });
      });
      it('Should throw if no body', () => {
        return pactum
          .spec()
          .withHeaders({ Authorization: 'Bearer $S{eduardoFpToken}' })
          .post('/posts/')
          .expectStatus(400)
          .expectJson({
            message: [
              'title must be a string',
              'title should not be empty',
              'content must be a string',
              'content should not be empty',
            ],
            error: 'Bad Request',
            statusCode: 400,
          });
      });
      it('Should throw if is missing title', () => {
        return pactum
          .spec()
          .withHeaders({ Authorization: 'Bearer $S{eduardoFpToken}' })
          .withBody({ content: dto.content })
          .post('/posts/')
          .expectJsonLike({
            message: ['title must be a string', 'title should not be empty'],
            error: 'Bad Request',
            statusCode: 400,
          })
          .expectStatus(400);
      });
      it('Should throw if no content', () => {
        return pactum
          .spec()
          .withHeaders({ Authorization: 'Bearer $S{eduardoFpToken}' })
          .withBody({ title: dto.title })
          .post('/posts/')
          .expectStatus(400)
          .expectJsonLike({
            message: [
              'content must be a string',
              'content should not be empty',
            ],
            error: 'Bad Request',
            statusCode: 400,
          });
      });
      it('Should not create post cause is not Eduardofp', () => {
        return pactum
          .spec()
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(dto)
          .post('/posts/')
          .expectStatus(401);
      });
      it('Should create post cause is Eduardofp', () => {
        return pactum
          .spec()
          .withHeaders({ Authorization: 'Bearer $S{eduardoFpToken}' })
          .withBody(dto)
          .post('/posts/')
          .expectStatus(201)
          .stores('postId', '_id');
      });
    });
    describe('Get feed', () => {
      it('Should get feed', () => {
        return pactum.spec().get('/posts/feed/').expectStatus(200);
      });
    });
    describe('Get post by id', () => {
      it('Should throw if it is a invalid id', () => {
        return pactum
          .spec()
          .get('/posts/2')
          .expectStatus(403)
          .expectBodyContains('Invalid id')
          .expectJsonLike({
            message: 'Invalid id.',
            error: 'Forbidden',
            statusCode: 403,
          });
      });
      it('Should throw if post was not found', () => {
        return pactum
          .spec()
          .get('/posts/feed/675a3823a12b00e2de4b7b61')
          .expectStatus(404);
      });
      it('Should get post', () => {
        return pactum
          .spec()
          .get('/posts/{id}')
          .withPathParams('id', '$S{postId}')
          .expectBodyContains('$S{postId}')
          .expectStatus(200);
      });
    });
    describe('Edit post by id', () => {
      it('Should throw if it is a invalid id', () => {
        return pactum
          .spec()
          .patch('/posts/2')
          .withHeaders({ Authorization: 'Bearer $S{eduardoFpToken}' })
          .expectStatus(403)
          .expectJsonLike({
            message: 'Invalid id.',
            error: 'Forbidden',
            statusCode: 403,
          });
      });
      it('Should throw if post was not found', () => {
        return pactum
          .spec()
          .patch('/posts/feed/675a3823a12b00e2de4b7b61')
          .withHeaders({ Authorization: 'Bearer $S{eduardoFpToken}' })
          .expectStatus(404);
      });
      it('Should update post', () => {
        return pactum
          .spec()
          .patch('/posts/{id}')
          .withHeaders({ Authorization: 'Bearer $S{eduardoFpToken}' })
          .withPathParams('id', '$S{postId}')
          .expectStatus(200);
      });
    });
    describe('Interaction module', () => {
      describe('Add like to a post', () => {
        it('Should throw if no bearer', () => {
          return pactum
            .spec()
            .post('/posts/{id}/likes')
            .withPathParams('id', '$S{postId}')
            .expectStatus(401);
        });
        it('Should throw if post was not found', () => {
          return pactum
            .spec()
            .post('/posts/675a3823a12b00e2de4b7b61/likes')
            .withHeaders({ Authorization: 'Bearer $S{userAt}' })
            .expectStatus(404);
        });
        it('Should add like', () => {
          return pactum
            .spec()
            .post('/posts/{id}/likes')
            .withPathParams('id', '$S{postId}')
            .withHeaders({ Authorization: 'Bearer $S{userAt}' })
            .expectStatus(201);
        });
      });
      describe('Delete like to a post', () => {
        it('Should throw if no bearer', () => {
          return pactum
            .spec()
            .delete('/posts/{id}/likes')
            .withPathParams('id', '$S{postId}')
            .expectStatus(401);
        });
        it('Should throw if post was not found', () => {
          return pactum
            .spec()
            .delete('/posts/675a3823a12b00e2de4b7b61/likes')
            .withHeaders({ Authorization: 'Bearer $S{userAt}' })
            .expectStatus(404);
        });
        it('Should remove like', () => {
          return pactum
            .spec()
            .delete('/posts/{id}/likes')
            .withPathParams('id', '$S{postId}')
            .withHeaders({ Authorization: 'Bearer $S{userAt}' })
            .expectStatus(204);
        });
      });
      describe('Comment posts', () => {
        describe('Add comment to a post', () => {
          it('Should throw if no bearer', () => {
            return pactum
              .spec()
              .post('/posts/{id}/comments')
              .withPathParams('id', '$S{postId}')
              .expectStatus(401);
          });
          it('Should throw if no body', () => {
            return pactum
              .spec()
              .post('/posts/{id}/comments')
              .withPathParams('id', '$S{postId}')
              .withHeaders({ Authorization: 'Bearer $S{userAt}' })
              .expectStatus(400);
          });
          it('Should create a comment', () => {
            return pactum
              .spec()
              .post('/posts/{id}/comments')
              .withPathParams('id', '$S{postId}')
              .withHeaders({ Authorization: 'Bearer $S{userAt}' })
              .withBody({ content: 'This is a test comment' })
              .expectStatus(201)
              .stores('commentId', '_id');
          });
        });
      });
      describe('Edit a comment', () => {
        it('Should throw if no bearer', () => {
          return pactum
            .spec()
            .patch('/posts/{postId}/comments/{id}')
            .withPathParams('id', '$S{commentId}')
            .withPathParams('postId', '$S{postId}')
            .expectStatus(401);
        });

        it('Should edit the comment', () => {
          return pactum
            .spec()
            .patch('/posts/{postId}/comments/{id}')
            .withPathParams('id', '$S{commentId}')
            .withPathParams('postId', '$S{postId}')
            .withHeaders({ Authorization: 'Bearer $S{userAt}' })
            .withBody({ content: 'comment updated' })
            .expectStatus(200);
        });
      });
      describe('Delete a comment', () => {
        it('Should throw if no bearer', () => {
          return pactum
            .spec()
            .delete('/posts/{postId}/comments/{id}')
            .withPathParams('id', '$S{commentId}')
            .withPathParams('postId', '$S{postId}')
            .expectStatus(401);
        });
        it('Should delete the comment', () => {
          return pactum
            .spec()
            .delete('/posts/{postId}/comments/{id}')
            .withPathParams('postId', '$S{postId}')
            .withHeaders({ Authorization: 'Bearer $S{userAt}' })
            .withPathParams('id', '$S{commentId}')
            .expectStatus(204);
        });
      });

      describe('Reply to a comment', () => {
        it('Should create a comment to reply to', () => {
          return pactum
            .spec()
            .post('/posts/{id}/comments/')
            .withPathParams('id', '$S{postId}')
            .withHeaders({ Authorization: 'Bearer $S{userAt}' })
            .withBody({ content: 'This is a parent comment' })
            .expectStatus(201)
            .stores('commentId', '_id')
            .stores('authorId', 'author');
        });
        it('Should add a reply', () => {
          return pactum
            .spec()
            .post('/posts/{postId}/comments/{id}/replies/?mention={authorId}')
            .withPathParams('id', '$S{commentId}')
            .withPathParams('postId', '$S{postId}')
            .withPathParams('authorId', '$S{authorId}')
            .withHeaders({ Authorization: 'Bearer $S{userAt}' })
            .withBody({ content: 'This is a reply' })
            .expectStatus(201)
            .stores('replyId', '_id');
        });
        it('Should get the comment with the reply', () => {
          return pactum
            .spec()
            .get('/posts/{postId}/comments/{commentId}/replies')
            .withPathParams('postId', '$S{postId}')
            .withPathParams('commentId', '$S{commentId}')
            .withHeaders({ Authorization: 'Bearer $S{userAt}' })
            .expectStatus(200)
            .expectBodyContains('This is a reply');
        });
        it('Should delete the reply', () => {
          return pactum
            .spec()
            .delete('/posts/{postId}/comments/{commentId}/replies/{replyId}')
            .withPathParams('replyId', '$S{replyId}')
            .withPathParams('postId', '$S{postId}')
            .withPathParams('commentId', '$S{commentId}')
            .withHeaders({ Authorization: 'Bearer $S{userAt}' })
            .expectStatus(204);
        });
      });
      describe('User', () => {
        describe('Delete User', () => {
          it('Should throw if no bearer', () => {
            return pactum.spec().delete('/users/me').expectStatus(401);
          });
          it('Should delete user', () => {
            return pactum
              .spec()
              .delete('/users/me')
              .withHeaders({ Authorization: 'Bearer $S{userAt}' })
              .expectStatus(204);
          });
        });
      });

      describe('Delete post by id', () => {
        it('Should throw if no bearer', () => {
          return pactum
            .spec()
            .delete('/posts/{id}')
            .withPathParams('id', '$S{postId}')
            .expectStatus(401);
        });
        it('Should throw if post was not found', () => {
          return pactum
            .spec()
            .delete('/posts/675a3823a12b00e2de4b7b61')
            .withHeaders({ Authorization: 'Bearer $S{eduardoFpToken}' })
            .expectStatus(404);
        });
        it('Should delete post', () => {
          return pactum
            .spec()
            .delete('/posts/{id}')
            .withPathParams('id', '$S{postId}')
            .withHeaders({ Authorization: 'Bearer $S{eduardoFpToken}' })
            .expectStatus(200);
        });
      });
    });
  });
});
