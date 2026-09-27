/**
 * Yasal / bilgilendirme sayfaları — TR/EN.
 * PayTR ve e-ticaret için gerekli temel metinler.
 */

export const legalPages = [
  {
    slug: "gizlilik",
    updatedAt: "2026-09-27",
    tr: {
      title: "Gizlilik Politikası",
      description:
        "Sarpé Atelier gizlilik politikası: kişisel verilerinizin nasıl toplandığı, kullanıldığı ve korunduğu hakkında bilgi.",
      lead: "Bu metin, Sarpé Atelier web sitesini kullanırken kişisel verilerinizin nasıl işlendiğini açıklar.",
      sections: [
        {
          heading: "Topladığımız veriler",
          body: "Sipariş ve iletişim süreçlerinde ad, soyad, e-posta, telefon, teslimat adresi ve ödeme işlemi için gerekli bilgilere ihtiyaç duyulabilir. Site kullanımı sırasında teknik günlükler (IP, tarayıcı türü) güvenlik ve performans amacıyla tutulabilir.",
        },
        {
          heading: "Verilerin kullanımı",
          body: "Verileriniz siparişin tamamlanması, kargo, müşteri desteği, yasal yükümlülükler ve site deneyiminin iyileştirilmesi için kullanılır. Pazarlama iletişimi yalnızca açık rızanız varsa yapılır.",
        },
        {
          heading: "Paylaşım",
          body: "Ödeme altyapısı (ör. PayTR), kargo ve barındırma gibi hizmet sağlayıcılarla yalnızca işlemin gerektirdiği ölçüde veri paylaşılabilir. Verileriniz izinsiz üçüncü taraflara satılmaz.",
        },
        {
          heading: "Saklama ve haklarınız",
          body: "Veriler, ilgili mevzuat ve işlemin gerektirdiği süre boyunca saklanır. KVKK kapsamındaki erişim, düzeltme ve silme talepleriniz için iletişim kanallarımız üzerinden bize yazabilirsiniz.",
        },
      ],
    },
    en: {
      title: "Privacy Policy",
      description:
        "Sarpé Atelier privacy policy: how we collect, use and protect your personal data.",
      lead: "This page explains how Sarpé Atelier processes personal data when you use our website.",
      sections: [
        {
          heading: "Data we collect",
          body: "For orders and support we may need your name, email, phone, delivery address and payment-related details. Technical logs (IP, browser type) may be kept for security and performance.",
        },
        {
          heading: "How we use data",
          body: "We use data to fulfil orders, shipping, customer support, legal duties and to improve the site. Marketing messages are only sent with your clear consent.",
        },
        {
          heading: "Sharing",
          body: "We may share data with payment providers (e.g. PayTR), shipping and hosting partners only as needed to complete the service. We do not sell your data.",
        },
        {
          heading: "Retention and your rights",
          body: "Data is kept for as long as required by law and the transaction. You may request access, correction or deletion via our contact channels.",
        },
      ],
    },
  },
  {
    slug: "iade-iptal",
    updatedAt: "2026-09-27",
    tr: {
      title: "İade ve İptal Koşulları",
      description:
        "Sarpé Atelier iade ve iptal koşulları: el yapımı ebru eserleri ve sipariş iptali hakkında bilgilendirme.",
      lead: "Her eser el emeğiyle üretildiğinden iade ve iptal kuralları aşağıda netleştirilmiştir.",
      sections: [
        {
          heading: "Sipariş iptali",
          body: "Ödeme tamamlanmadan veya kargoya verilmeden önce siparişinizi iptal etmek isterseniz bizimle iletişime geçin. Kargoya verilen siparişlerde iptal yerine iade süreci işletilir.",
        },
        {
          heading: "Cayma hakkı",
          body: "Mesafeli satış kapsamında, ürün size ulaştıktan sonra yasal süre içinde cayma hakkınızı kullanabilirsiniz. Ambalajı açılmamış, zarar görmemiş ve yeniden satılabilir durumda olması gerekir. Kişiye özel / sipariş üzerine üretilmiş eserlerde mevzuatın öngördüğü istisnalar geçerli olabilir.",
        },
        {
          heading: "İade süreci",
          body: "İade talebinizi e-posta ile bildirin; onay sonrası ürünü belirtilen adrese gönderin. İnceleme ardından uygunsa ücret iadesi, ödeme yönteminize göre yapılır. İade kargo ücreti, ayıplı ürün durumları dışında alıcıya ait olabilir.",
        },
        {
          heading: "Hasarlı teslimat",
          body: "Kargo sırasında hasar oluşmuşsa teslim anında tutanak tutturmanızı ve en kısa sürede fotoğraflarla bize ulaşmanızı rica ederiz. Ayıplı ürünlerde değiştirme veya iade seçenekleri sunulur.",
        },
      ],
    },
    en: {
      title: "Returns & Cancellation",
      description:
        "Sarpé Atelier returns and cancellation policy for handmade Ebru works and orders.",
      lead: "Because every piece is handmade, returns and cancellations follow the rules below.",
      sections: [
        {
          heading: "Order cancellation",
          body: "Contact us before payment is completed or before shipping to cancel. Once shipped, the returns process applies instead of cancellation.",
        },
        {
          heading: "Right of withdrawal",
          body: "Under distance-selling rules you may withdraw within the legal period after delivery if the item is unused, undamaged and resalable. Custom or made-to-order works may fall under legal exceptions.",
        },
        {
          heading: "Return process",
          body: "Email your return request; after approval send the item to the address we provide. If accepted, refunds follow your original payment method. Return shipping may be at the buyer’s expense except for defective goods.",
        },
        {
          heading: "Damaged delivery",
          body: "If the parcel arrives damaged, please record it with the courier and contact us promptly with photos. We offer replacement or refund for defective items.",
        },
      ],
    },
  },
  {
    slug: "kargo",
    updatedAt: "2026-09-27",
    tr: {
      title: "Kargo ve Teslimat",
      description:
        "Sarpé Atelier kargo ve teslimat bilgileri: süreler, paketleme ve gönderim koşulları.",
      lead: "Eserleriniz özenle paketlenir ve güvenli şekilde gönderilir.",
      sections: [
        {
          heading: "Hazırlık süresi",
          body: "Stoktaki eserlerde genellikle 1–3 iş günü içinde kargoya verilir. Sipariş üzerine üretim veya özel boyutlarda süre uzayabilir; bilgilendirme sipariş sırasında yapılır.",
        },
        {
          heading: "Gönderim",
          body: "Türkiye içi gönderimler anlaşmalı kargo firmalarıyla yapılır. Yurt dışı talepler için ayrıca iletişime geçebilirsiniz. Takip numarası e-posta ile paylaşılır.",
        },
        {
          heading: "Paketleme",
          body: "Ebru eserleri nem, ezilme ve çizilmeye karşı koruyucu ambalajla paketlenir. Çerçeveli ürünlerde ekstra destek kullanılır.",
        },
        {
          heading: "Teslimat sorunları",
          body: "Adres eksikliği veya teslim alınamayan gönderilerde kargo firmasının iade sürecine göre hareket edilir. Güncel adres bilginizi siparişte eksiksiz yazmanız önemlidir.",
        },
      ],
    },
    en: {
      title: "Shipping & Delivery",
      description:
        "Sarpé Atelier shipping information: timelines, packaging and delivery terms.",
      lead: "Your works are carefully packed and shipped securely.",
      sections: [
        {
          heading: "Preparation time",
          body: "In-stock pieces usually ship within 1–3 business days. Made-to-order or special sizes may take longer; we confirm timing with your order.",
        },
        {
          heading: "Shipping",
          body: "Domestic orders in Türkiye ship with partner carriers. For international requests, contact us. Tracking is shared by email.",
        },
        {
          heading: "Packaging",
          body: "Ebru works are packed against moisture, crushing and scratches. Framed pieces get extra protection.",
        },
        {
          heading: "Delivery issues",
          body: "Incomplete addresses or uncollected parcels follow the carrier’s return process. Please provide a complete delivery address at checkout.",
        },
      ],
    },
  },
];

export function getLegalBySlug(slug) {
  return legalPages.find((p) => p.slug === slug) || null;
}

export function getLegalLocalized(page, locale) {
  if (!page) return null;
  const lang = locale === "en" ? "en" : "tr";
  return {
    slug: page.slug,
    updatedAt: page.updatedAt,
    ...page[lang],
  };
}

export function listLegal(locale) {
  return legalPages.map((p) => getLegalLocalized(p, locale));
}
