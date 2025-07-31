export interface RegisterDTO {
  /**
   * Foydalanuvchining to'liq ismi
   */
  full_name: string;

  /**
   * Telefon raqami
   */
  phone_number: string;

  /**
   * Elektron pochta
   */
  email: string;

  /**
   * Parol
   */
  password: string;

  /**
   * Mamlakat identifikatori
   */
  country_id: number;

  /**
   * Rasm fayli
   */
  picture?: File; // Rasm majburiy bo'lmagan maydon sifatida belgilangan
}
