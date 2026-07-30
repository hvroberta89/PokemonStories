declare const brand: unique symbol;

export type BrandedId<TBrand extends string> = string & {
  readonly [brand]: TBrand;
};