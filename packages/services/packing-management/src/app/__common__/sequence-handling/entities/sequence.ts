import { Column, Entity } from "typeorm";

@Entity("_common_sequence")
export class SequenceEntity {
  @Column("varchar", { primary: true, name: "sequence_name", length: 100 })
  sequenceName: string;

  @Column("int", { name: "increment", default: 1 })
  increment: number;

  @Column("int", { name: "min_value", default: 1 })
  minValue: number;

  @Column("bigint", { name: "cur_value", nullable: true, default: 1 })
  curValue: number | null;

  @Column("tinyint", { name: "cycle", width: 1, default: 0 })
  cycle: boolean;
}
