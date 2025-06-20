
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { NftEntity } from './nft.entity';
import { CollectionEntity } from './collection.entity';
import { TransactionEntity } from './transaction.entity';
import { OfferEntity } from './offer.entity';
import { ReportEntity } from './report.entity';
import { UserRole } from '@/types/entities'; // Assuming enums are accessible

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', unique: true })
  username!: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  email?: string;

  @Column({ type: 'varchar', nullable: true, select: false }) // select: false to not return by default
  passwordHash?: string;

  @Column({ type: 'varchar', unique: true })
  walletAddress!: string;

  @Column({ type: 'varchar', nullable: true })
  avatarUrl?: string;

  @Column({ type: 'varchar', nullable: true })
  coverUrl?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ type: 'jsonb', nullable: true })
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    website?: string;
    discord?: string;
  };

  @Column({ type: 'boolean', default: false })
  isEmailVerified?: boolean;

  @Column({ type: 'boolean', default: false })
  isWalletVerified?: boolean;

  @Column({
    type: 'enum',
    enum: UserRole,
    array: true,
    default: [UserRole.USER],
  })
  roles!: UserRole[];

  @Column({ type: 'timestamp with time zone', nullable: true })
  lastLoginAt?: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt!: Date;

  // Relationships
  @OneToMany(() => NftEntity, nft => nft.creator)
  createdNfts!: NftEntity[];

  @OneToMany(() => NftEntity, nft => nft.owner)
  ownedNfts!: NftEntity[];

  @OneToMany(() => CollectionEntity, collection => collection.creator)
  createdCollections!: CollectionEntity[];

  @OneToMany(() => TransactionEntity, transaction => transaction.fromUser)
  sentTransactions!: TransactionEntity[];

  @OneToMany(() => TransactionEntity, transaction => transaction.toUser)
  receivedTransactions!: TransactionEntity[];

  @OneToMany(() => OfferEntity, offer => offer.offerer)
  madeOffers!: OfferEntity[];

  @OneToMany(() => OfferEntity, offer => offer.owner) // Owner at the time of offer
  receivedOffersOnNfts!: OfferEntity[];
  
  @OneToMany(() => ReportEntity, report => report.reporter)
  submittedReports!: ReportEntity[];

  @OneToMany(() => ReportEntity, report => report.resolvedByUser)
  resolvedReports!: ReportEntity[];
  
  // Example for favorited NFTs (Many-to-Many)
  @ManyToMany(() => NftEntity, nft => nft.favoritedByUsers)
  @JoinTable({
    name: 'user_favorites_nft',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'nftId', referencedColumnName: 'id' },
  })
  favoriteNfts!: NftEntity[];
}
