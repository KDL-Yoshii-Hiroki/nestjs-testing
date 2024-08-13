import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('PostsService', () => {
  let service: PostsService;
  let repository: Repository<Post>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Post),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    repository = module.get<Repository<Post>>(getRepositoryToken(Post));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const postsArray = [{ id: 1, title: 'Test Post', content: 'Test Content' }];
      jest.spyOn(repository, 'find').mockResolvedValue(postsArray);

      expect(await service.findAll()).toEqual(postsArray);
    });
  });

  describe('findOne', () => {
    it('should return a single post', async () => {
      const post = { id: 1, title: 'Test Post', content: 'Test Content' };
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(post);

      expect(await service.findOne(1)).toEqual(post);
    });

    it('should throw a NotFoundException if post not found', async () => {
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const newPost = { title: 'New Post', content: 'New Content' };
      const savedPost = { id: 1, ...newPost };
      jest.spyOn(repository, 'save').mockResolvedValue(savedPost);

      expect(await service.create(newPost as Post)).toEqual(savedPost);
    });
  });

  describe('remove', () => {
    it('should remove a post', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1 , raw: {} });

      await expect(service.remove(1)).resolves.toBeUndefined();
    });

    it('should throw a NotFoundException if post to remove does not exist', async () => {
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0 , raw: {} });

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      const updatedPost = { id: 1, title: 'Updated Post', content: 'Updated Content' };
      jest.spyOn(repository, 'update').mockResolvedValue(undefined);
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(updatedPost);

      expect(await service.update(1, updatedPost as Post)).toEqual(updatedPost);
    });

    it('should throw a NotFoundException if post to update does not exist', async () => {
      jest.spyOn(repository, 'update').mockResolvedValue(undefined);
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      await expect(service.update(1, { title: 'Updated Post', content: 'Updated Content' } as Post)).rejects.toThrow(NotFoundException);
    });
  });
});
