export type LicenseFields = {
  permis_picture?: string | null;
  permis_verified?: boolean | null;
};

/** User must have uploaded a license AND be verified by an admin before booking / publishing listings. */
export function hasVerifiedLicense(profile: LicenseFields | null | undefined): boolean {
  const url = profile?.permis_picture?.trim();
  return Boolean(url) && profile?.permis_verified === true;
}
