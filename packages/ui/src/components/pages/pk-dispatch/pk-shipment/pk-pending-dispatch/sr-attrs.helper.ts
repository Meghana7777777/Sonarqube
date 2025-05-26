import { PkDSetItemModel, PkShippingReqesutItemAttrsModel } from "@xpparel/shared-models";
import { PKMSPackListAttrsModel } from "packages/libs/shared-models/src/pkms/pkms-pack-list-order-info/pkms-pack-list-attribute-dto";
export const constructSrUniqueAttrs = (attrs: PkShippingReqesutItemAttrsModel[]) => {
    const moNos = new Set<string>();
    const styles = new Set<string>();
    const buyers = new Set<string>();
    const dests = new Set<string>();
    const delDates = new Set<string>();
    const vpos = new Set<string>();
    const cos = new Set<string>();

    attrs.forEach(a => {
      a.coNos.forEach(c => { cos.add(c); });
      a.moNo.split(',').forEach(s => moNos.add(s));
      a.delDates.forEach(s => delDates.add(s));
      a.destinations.forEach(s => dests.add(s));
      a.styles.forEach(s => styles.add(s));
      a.poNos.forEach(s => vpos.add(s));
      a.buyers.forEach(s => buyers.add(s));
    });
    return {
      moNos: Array.from(moNos)?.toString(),
      poNos: Array.from(vpos)?.toString(),
      buyers: Array.from(buyers)?.toString(),
      dests: Array.from(dests)?.toString(),
      delDates: Array.from(delDates)?.toString(),
      cos: Array.from(cos)?.toString(),
      styles: Array.from(styles)?.toString(),
    }
}


export const constructDrUniqueAttrs = (attrs: PkDSetItemModel[]) => {
  const moNos = new Set<string>();
  const styles = new Set<string>();
  const buyers = new Set<string>();
  const dests = new Set<string>();
  const delDates = new Set<string>();
  const vpos = new Set<string>();
  const cos = new Set<string>();

  // export enum PkDSetItemAttrEnum {
  //   PSTREF = 'lm1', // plant style REF
  //   CO = 'l3', // customer order no
  //   VPO = 'l4', // vendor purchase no
  //   PNM = 'lm2', // product name
  //   DDT = 'l8', // delivery date
  //   DEST = 'l5', // destination
  //   STY = 'l2', // style
  //   BUY='lm4' //buyers
  // }

  attrs.forEach(a => {
    a.itemAttributes?.l1?.split(',').forEach(s => moNos.add(s));
    a.itemAttributes?.l2?.split(',').forEach(s => styles.add(s));
    a.itemAttributes?.l3?.split(',').forEach(s => cos.add(s));
    a.itemAttributes?.l4?.split(',').forEach(s => vpos.add(s));
    a.itemAttributes?.lm2?.split(',').forEach(s => dests.add(s));
    a.itemAttributes?.lm4?.split(',').forEach(s => buyers.add(s));
    a.itemAttributes?.l8?.split(',').forEach(s => delDates.add(s));
  });
  return {
    moNos: Array.from(moNos)?.toString(),
    poNos: Array.from(vpos)?.toString(),
    buyers: Array.from(buyers)?.toString(),
    dests: Array.from(dests)?.toString(),
    delDates: Array.from(delDates)?.toString(),
    cos: Array.from(cos)?.toString(),
    styles: Array.from(styles)?.toString(),
  }
}

export const constructPlUniqueAttrs = (attrs: PKMSPackListAttrsModel[]) => {
  const moNos = new Set<string>();
  const styles = new Set<string>();
  const buyers = new Set<string>();
  const dests = new Set<string>();
  const delDates = new Set<string>();
  const vpos = new Set<string>();
  const cos = new Set<string>();
  const prodNames = new Set<string>();

  attrs.forEach(a => {
    a.buyers.forEach(s => buyers.add(s));
    a.delDates.forEach(s => delDates.add(s));
    a.destinations.forEach(s => dests.add(s));
    a.prodNames.forEach(s => prodNames.add(s));
    a.moNos.forEach(s => moNos.add(s));
    a.styles.forEach(s => styles.add(s));
    a.vpos.forEach(s => vpos.add(s));
  });
  return {
    moNos: Array.from(moNos)?.toString(),
    poNos: Array.from(vpos)?.toString(),
    buyers: Array.from(buyers)?.toString(),
    dests: Array.from(dests)?.toString(),
    delDates: Array.from(delDates)?.toString(),
    cos: Array.from(cos)?.toString(),
    styles: Array.from(styles)?.toString(),
    prodNames: Array.from(prodNames)?.toString(),
  }
}
