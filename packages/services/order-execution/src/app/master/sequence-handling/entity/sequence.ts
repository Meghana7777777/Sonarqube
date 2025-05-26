import { Column, Entity } from "typeorm";

@Entity("sequence")
export class Sequence {
  @Column("varchar", { primary: true, name: "sequence_name", length: 100 })
  sequenceName: string;

  @Column("int", { name: "increment", default: () => "'1'" })
  increment: number;

  @Column("int", { name: "min_value", default: () => "'1'" })
  minValue: number;

  @Column("bigint", {
    name: "max_value",
    default: () => "'9223372036854775807'",
  })
  maxValue: string;

  @Column("bigint", { name: "cur_value", nullable: true, default: () => "'1'" })
  curValue: number | null;

  @Column("tinyint", { name: "cycle", width: 1, default: () => "'0'" })
  cycle: boolean;
}
