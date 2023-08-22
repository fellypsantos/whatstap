const sql = `
  ALTER TABLE "settings" ADD COLUMN "last_country_iso" TEXT;
  ALTER TABLE "settings" ADD COLUMN "disabled_phone_mask" INTEGER;
`;

export default sql;
