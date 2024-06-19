import { Rental } from 'src/rental/entities/rental.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  publicationYear: string;

  @Column()
  description: string;

  @Column({ unique: true })
  ISBNNo: string;

  @Column()
  coverImage: string;

  @Column()
  quantity: number;

  @Column('text', { array: true })
  genre: string[];

  @OneToMany(() => Rental, (rental) => rental.book)
  rentals: Rental[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
