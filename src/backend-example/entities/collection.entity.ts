
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { NftEntity } from './nft.entity';

@Entity('collections')
export class CollectionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true })
  name!: string;

  @Column({ type: 'varchar', unique: true })
  slug!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', nullable: true })
  logoImageUrl?: string;

  @Column({ type: 'varchar', nullable: true })
  coverImageUrl?: string;

  @Column({ type: 'varchar', nullable: true })
  bannerImageUrl?: string;

  @Column({ type: 'uuid' }) // Foreign key for creator
  creatorId!: string;

  @Column({ type: 'varchar', nullable: true })
  category?: string;

  // itemCount, ownerCount, volumeTraded, floorPrice would likely be derived/updated via triggers or services
  // Or stored and updated, but can become complex to keep consistent.
  // For simplicity, they are omitted here or can be added as simple columns if managed manually/periodically.
  
  @Column({ type: 'integer', default: 0, comment: 'Denormalized count, update via triggers or services' })
  itemCount?: number;

  @Column({ type: 'decimal', precision: 18, scale: 8, nullable: true, comment: 'Denormalized, update via triggers or services' })
  volumeTraded?: number; 
  
  @Column({ type: 'decimal', precision: 18, scale: 8, nullable: true, comment: 'Denormalized, update via triggers or services' })
  floorPrice?: number;

  @Column({ type: 'boolean', default: false })
  isVerified?: boolean;

  @Column({ type: 'boolean', default: false })
  isExplicit?: boolean;

  @Column({ type: 'jsonb', nullable: true })
  externalLinks?: {
    website?: string;
    discord?: string;
    twitter?: string;
    telegram?: string;
    medium?: string;
  };

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt!: Date;

  // Relationships
  @ManyToOne(() => UserEntity, user => user.createdCollections, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'creatorId' })
  creator!: UserEntity;

  @OneToMany(() => NftEntity, nft => nft.collection)
  nfts!: NftEntity[];
}
