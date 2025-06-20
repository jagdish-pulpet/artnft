
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { ReportStatus, ReportedItemType } from '@/types/entities'; // Assuming enums are accessible

@Entity('reports')
export class ReportEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  reporterId!: string;

  @Column({ type: 'uuid' }) // Can be NFT ID, User ID, Collection ID
  reportedItemId!: string;

  @Column({ type: 'enum', enum: ReportedItemType })
  reportedItemType!: ReportedItemType;

  @Column({ type: 'varchar' }) // Could be an enum if reasons are predefined
  reason!: string;

  @Column({ type: 'text', nullable: true })
  details?: string;

  @Column({ type: 'enum', enum: ReportStatus, default: ReportStatus.PENDING_REVIEW })
  status!: ReportStatus;

  @Column({ type: 'text', nullable: true })
  adminNotes?: string;

  @Column({ type: 'uuid', nullable: true })
  resolvedByUserId?: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  resolvedAt?: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt!: Date;

  // Relationships
  @ManyToOne(() => UserEntity, user => user.submittedReports, { onDelete: 'SET NULL' }) // If reporter is deleted, keep report but nullify reporter
  @JoinColumn({ name: 'reporterId' })
  reporter!: UserEntity;

  @ManyToOne(() => UserEntity, user => user.resolvedReports, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'resolvedByUserId' })
  resolvedByUser?: UserEntity;

  // Note: reportedItem relation is polymorphic and typically handled at service layer
  // or via separate nullable foreign keys if item types are limited and known.
  // For simplicity, we keep reportedItemId and reportedItemType.
}
