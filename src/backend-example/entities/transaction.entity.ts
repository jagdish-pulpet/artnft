
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { NftEntity } from './nft.entity';
import { CollectionEntity } from './collection.entity';
import { UserEntity } from './user.entity';
import { TransactionType } from '@/types/entities'; // Assuming enums are accessible

export enum TransactionStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
  PROCESSING = 'processing',
}

@Entity('transactions')
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', nullable: true })
  nftId?: string;

  @Column({ type: 'uuid', nullable: true })
  collectionId?: string;

  @Column({ type: 'enum', enum: TransactionType })
  transactionType!: TransactionType;

  @Column({ type: 'uuid', nullable: true })
  fromUserId?: string;

  @Column({ type: 'uuid', nullable: true })
  toUserId?: string;

  @Column({ type: 'decimal', precision: 18, scale: 8, nullable: true })
  price?: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  currency?: string;

  @Column({ type: 'varchar', nullable: true, unique: true }) // Blockchain tx hash should be unique if present
  blockchainTransactionHash?: string;

  @Column({ type: 'decimal', precision: 18, scale: 8, nullable: true })
  gasFee?: number;

  @Column({ type: 'decimal', precision: 18, scale: 8, nullable: true })
  platformFee?: number;

  @Column({ type: 'timestamp with time zone' })
  timestamp!: Date;

  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.PENDING })
  status!: TransactionStatus;

  @Column({ type: 'jsonb', nullable: true })
  details?: Record<string, any>;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt!: Date;

  // Relationships
  @ManyToOne(() => NftEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'nftId' })
  nft?: NftEntity;

  @ManyToOne(() => CollectionEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'collectionId' })
  collection?: CollectionEntity;

  @ManyToOne(() => UserEntity, user => user.sentTransactions, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'fromUserId' })
  fromUser?: UserEntity;

  @ManyToOne(() => UserEntity, user => user.receivedTransactions, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'toUserId' })
  toUser?: UserEntity;
}
