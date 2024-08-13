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
      // モックデータ
      const postsArray = [{ id: 1, title: 'Test Post', content: 'Test Content' }];
      // findメソッドがモックデータを返すように設定
      jest.spyOn(repository, 'find').mockResolvedValue(postsArray);
      // findAllメソッドが正しくモックデータを返すか確認
      expect(await service.findAll()).toEqual(postsArray);
    });
  });
  
  describe('findOne', () => {
    it('should return a single post', async () => {
      // モックデータ
      const post = { id: 1, title: 'Test Post', content: 'Test Content' };
      // findOneByメソッドがモックデータを返すように設定
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(post);
      // findOneメソッドが正しくモックデータを返すか確認
      expect(await service.findOne(1)).toEqual(post);
    });

    it('should throw a NotFoundException if post not found', async () => {
      // データが見つからない場合にnullを返すように設定
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
      // findOneメソッドがNotFoundExceptionを投げるか確認
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new post', async () => {
      // 新しい投稿データ
      const newPost = { title: 'New Post', content: 'New Content' };
      // 保存後のデータ
      const savedPost = { id: 1, ...newPost };
      // saveメソッドが保存後のデータを返すように設定
      jest.spyOn(repository, 'save').mockResolvedValue(savedPost);
      // createメソッドが正しく保存後のデータを返すか確認
      expect(await service.create(newPost as Post)).toEqual(savedPost);
    });
  });

  describe('remove', () => {
    it('should remove a post', async () => {
      // deleteメソッドが正常に削除されたことを示す結果を返すように設定
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1 , raw: {} });
      // removeメソッドが例外を投げず、正常に完了することを確認
      await expect(service.remove(1)).resolves.toBeUndefined();
    });

    it('should throw a NotFoundException if post to remove does not exist', async () => {
      // deleteメソッドが削除対象が存在しないことを示す結果を返すように設定
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 0 , raw: {} });
      // removeメソッドがNotFoundExceptionを投げるか確認
      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      // 更新後の投稿データ
      const updatedPost = { id: 1, title: 'Updated Post', content: 'Updated Content' };
      // findOneByとupdateメソッドのモック設定
      jest.spyOn(repository, 'update').mockResolvedValue(undefined);
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(updatedPost);
      // updateメソッドが正しく更新されたデータを返すか確認
      expect(await service.update(1, updatedPost as Post)).toEqual(updatedPost);
    });

    it('should throw a NotFoundException if post to update does not exist', async () => {
      // データが見つからない場合にnullを返すように設定
      jest.spyOn(repository, 'update').mockResolvedValue(undefined);
      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
      // updateメソッドがNotFoundExceptionを投げるか確認
      await expect(service.update(1, { title: 'Updated Post', content: 'Updated Content' } as Post)).rejects.toThrow(NotFoundException);
    });
  });
});
