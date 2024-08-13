import { Controller, Get, Post,Put,Body, Param, Delete } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post as PostEntity } from './post.entity';


@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(): Promise<PostEntity[]> {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<PostEntity> {
    return this.postsService.findOne(id);
  }

  @Post()
  create(@Body() post: PostEntity): Promise<PostEntity> {
    return this.postsService.create(post);
  }
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() post: PostEntity,
  ): Promise<PostEntity> {
    await this.postsService.update(id, post);
    return this.postsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.postsService.remove(id);
  }
}
