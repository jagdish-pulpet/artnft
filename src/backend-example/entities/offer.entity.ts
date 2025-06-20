
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { NftEntity } from './nft.entity';
import { UserEntity } from './user.entity';
import { OfferStatus } from '@/types/entities'; // Assuming enums are accessible

@Entity('offers')
export class OfferEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  nftId!: string;

  @Column({ type: 'uuid' })
  offererId!: string;
  
  @Column({ type: 'uuid' }) // Store the owner at the time of the offer for record keeping
  ownerIdAtOffer!: string;

  @Column({ type: 'decimal', precision: 18, scale: 8 })
  offerAmount!: number;

  @Column({ type: 'varchar', length: 10 })
  currency!: string;

  @Column({ type: 'enum', enum: OfferStatus, default: OfferStatus.PENDING })
  status!: OfferStatus;

  @Column({ type: 'timestamp with time zone', nullable: true })
  expiresAt?: Date;

  @Column({ type: 'varchar', nullable: true, unique: true })
  blockchainTransactionHash?: string; // If offer is made/accepted on-chain

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt!: Date;

  // Relationships
  @ManyToOne(() => NftEntity, { onDelete: 'CASCADE' }) // If NFT is deleted, offers for it should be removed
  @JoinColumn({ name: 'nftId' })
  nft!: NftEntity;

  @ManyToOne(() => UserEntity, user => user.madeOffers, { onDelete: 'CASCADE' }) // If user deleted, their offers are removed
  @JoinColumn({ name: 'offererId' })
  offerer!: UserEntity;

  @ManyToOne(() => UserEntity, user => user.receivedOffersOnNfts, { onDelete: 'CASCADE' }) // If owner (at time of offer) deleted
  @JoinColumn({ name: 'ownerIdAtOffer' })
  owner!: UserEntity; // User who owned the NFT when offer was made
}
