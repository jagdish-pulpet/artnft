
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, ManyToMany, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { CollectionEntity } from './collection.entity';
import { NftListingType, NftProperty } from '@/types/entities'; // Assuming enums/types are accessible

@Entity('nfts')
export class NftEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', nullable: true })
  tokenId?: string; // Blockchain-specific ID

  @Column({ type: 'varchar', nullable: true })
  contractAddress?: string;

  @Column({ type: 'varchar' })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar' })
  imageUrl!: string;

  @Column({ type: 'varchar', nullable: true })
  mediaUrl?: string;

  @Column({ type: 'varchar', nullable: true })
  mediaType?: string;

  @Column({ type: 'varchar', nullable: true })
  animationUrl?: string;
  
  @Column({ type: 'varchar', nullable: true })
  externalUrl?: string;

  @Column({ type: 'uuid' }) // Foreign key for creator
  creatorId!: string;

  @Column({ type: 'uuid' }) // Foreign key for owner
  ownerId!: string;

  @Column({ type: 'uuid', nullable: true }) // Foreign key for collection
  collectionId?: string;
  
  @Column({ type: 'decimal', precision: 18, scale: 8, nullable: true }) // For crypto prices
  price?: number; // Store as number, format as string in DTOs/frontend

  @Column({ type: 'varchar', length: 10, nullable: true })
  currency?: string;

  @Column({ type: 'boolean', default: false })
  isListedForSale!: boolean;

  @Column({ type: 'enum', enum: NftListingType, nullable: true })
  listingType?: NftListingType;

  @Column({ type: 'timestamp with time zone', nullable: true })
  auctionEndDate?: Date;

  @Column({ type: 'jsonb', nullable: true })
  properties?: NftProperty[];

  @Column({ type: 'jsonb', nullable: true })
  royalties?: { recipientAddress: string; percentagePoints: number }[];

  @Column({ type: 'integer', default: 0 })
  views?: number;

  @Column({ type: 'integer', default: 0 })
  favoritesCount?: number;

  @Column({ type: 'timestamp with time zone' })
  mintedAt!: Date;
  
  @Column({ type: 'timestamp with time zone', nullable: true })
  lastSaleAt?: Date;

  @Column({ type: 'decimal', precision: 18, scale: 8, nullable: true })
  lastSalePrice?: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  lastSaleCurrency?: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt!: Date;

  // Relationships
  @ManyToOne(() => UserEntity, user => user.createdNfts, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'creatorId' })
  creator!: UserEntity;

  @ManyToOne(() => UserEntity, user => user.ownedNfts, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'ownerId' })
  owner!: UserEntity;

  @ManyToOne(() => CollectionEntity, collection => collection.nfts, { onDelete: 'SET NULL', onUpdate: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'collectionId' })
  collection?: CollectionEntity;

  @ManyToMany(() => UserEntity, user => user.favoriteNfts)
  favoritedByUsers!: UserEntity[]; // Users who favorited this NFT
}
