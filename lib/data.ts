export const business = {
  name: 'Abejita Cakes',
  whatsappNumber: '51966123456',
  whatsappDisplay: '+51 966 123 456',
  address: 'Jr. 28 de Julio 345, Huamanga, Ayacucho',
  hours: [
    { days: 'Lunes a sábado', time: '8:00 a. m. – 8:00 p. m.' },
    { days: 'Domingos', time: '9:00 a. m. – 1:00 p. m.' },
  ],
  responseTime: 'Respondemos en menos de 30 minutos dentro del horario de atención.',
  social: {
    instagram: 'https://instagram.com/abejitacakes',
    facebook: 'https://facebook.com/abejitacakes',
    tiktok: 'https://tiktok.com/@abejitacakes',
  },
}

export type CategoryId =
  | 'clasicas'
  | 'personalizadas'
  | 'salados'
  | 'dulces'
  | 'combos'

export const categories: { id: CategoryId; label: string }[] = [
  { id: 'clasicas', label: 'Tortas clásicas' },
  { id: 'personalizadas', label: 'Tortas personalizadas' },
  { id: 'salados', label: 'Bocaditos salados' },
  { id: 'dulces', label: 'Bocaditos dulces' },
  { id: 'combos', label: 'Combos / eventos' },
]

export type Product = {
  id: string
  name: string
  description: string
  size: string
  priceFrom: number
  category: CategoryId
  image: string
  tag?: string
}

export const products: Product[] = [
  {
    id: 'torta-chocolate',
    name: 'Torta de chocolate con fudge',
    description: 'Bizcocho húmedo de cacao, relleno y cubierto con nuestro fudge casero.',
    size: '20 a 25 porciones',
    priceFrom: 75,
    category: 'clasicas',
    image: '/images/products/torta-chocolate.png',
    tag: 'Más pedida',
  },
  {
    id: 'tres-leches',
    name: 'Tres leches clásica',
    description: 'Bizcocho esponjoso bañado en tres leches, con merengue y canela.',
    size: '15 a 20 porciones',
    priceFrom: 65,
    category: 'clasicas',
    image: '/images/products/tres-leches.png',
  },
  {
    id: 'selva-negra',
    name: 'Selva negra',
    description: 'Chocolate, crema chantilly y cerezas al marrasquino con virutas.',
    size: '20 porciones',
    priceFrom: 80,
    category: 'clasicas',
    image: '/images/products/selva-negra.png',
  },
  {
    id: 'torta-infantil',
    name: 'Torta temática infantil',
    description: 'Diseño a tu elección con figuras de fondant y colores del personaje favorito.',
    size: '25 a 30 porciones',
    priceFrom: 120,
    category: 'personalizadas',
    image: '/images/products/torta-infantil.png',
    tag: 'Personalizable',
  },
  {
    id: 'torta-boda',
    name: 'Torta de matrimonio',
    description: 'Tres pisos de vainilla y frutos rojos, decorada con flores naturales.',
    size: '80 a 100 porciones',
    priceFrom: 450,
    category: 'personalizadas',
    image: '/images/products/torta-boda.png',
  },
  {
    id: 'torta-floral',
    name: 'Torta floral en buttercream',
    description: 'Flores pintadas a manga, ideal para el Día de la Madre o aniversarios.',
    size: '15 a 20 porciones',
    priceFrom: 95,
    category: 'personalizadas',
    image: '/images/products/torta-floral.png',
  },
  {
    id: 'empanaditas',
    name: 'Empanaditas de carne',
    description: 'Masa hojaldrada rellena de carne sazonada, aceituna y huevo.',
    size: 'Ciento (100 unid.)',
    priceFrom: 60,
    category: 'salados',
    image: '/images/products/empanaditas.png',
  },
  {
    id: 'tequenos',
    name: 'Tequeños de queso',
    description: 'Crocantes, rellenos de queso fresco ayacuchano, con salsa de guacamole.',
    size: 'Ciento (100 unid.)',
    priceFrom: 55,
    category: 'salados',
    image: '/images/products/tequenos.png',
  },
  {
    id: 'causitas',
    name: 'Mini causitas de pollo',
    description: 'Papa amarilla con ají, relleno de pollo, palta y aceituna.',
    size: 'Ciento (100 unid.)',
    priceFrom: 70,
    category: 'salados',
    image: '/images/products/causitas.png',
  },
  {
    id: 'alfajores',
    name: 'Alfajores de manjar blanco',
    description: 'Galleta que se deshace en la boca, rellena de manjar blanco casero.',
    size: 'Ciento (100 unid.)',
    priceFrom: 50,
    category: 'dulces',
    image: '/images/products/alfajores.png',
    tag: 'Favorito',
  },
  {
    id: 'trufas',
    name: 'Trufas y brigadeiros',
    description: 'Surtido de trufas de chocolate, coco y brigadeiros con grana.',
    size: 'Ciento (100 unid.)',
    priceFrom: 65,
    category: 'dulces',
    image: '/images/products/trufas.png',
  },
  {
    id: 'mini-pies',
    name: 'Mini pies de limón y fresa',
    description: 'Tartaletas con merengue tostado y crema pastelera con fresas.',
    size: 'Ciento (100 unid.)',
    priceFrom: 80,
    category: 'dulces',
    image: '/images/products/mini-pies.png',
  },
  {
    id: 'combo-cumple',
    name: 'Combo Cumpleañero',
    description: 'Torta mediana + 50 bocaditos salados + 50 dulces a elección.',
    size: 'Para 25 personas',
    priceFrom: 185,
    category: 'combos',
    image: '/images/products/combo-cumple.png',
    tag: 'Ahorra S/ 30',
  },
  {
    id: 'mesa-dulce',
    name: 'Mesa dulce para eventos',
    description: 'Torta central, cupcakes, cake pops y mini postres decorados con tu temática.',
    size: 'Para 50 a 80 personas',
    priceFrom: 520,
    category: 'combos',
    image: '/images/products/mesa-dulce.png',
  },
  {
    id: 'box-reunion',
    name: 'Box Reunión',
    description: 'Caja de regalo con 40 bocaditos surtidos dulces y salados.',
    size: 'Para 8 a 10 personas',
    priceFrom: 75,
    category: 'combos',
    image: '/images/products/box-reunion.png',
  },
]

export type GalleryItem = {
  src: string
  alt: string
  caption: string
  orientation: 'portrait' | 'landscape' | 'square'
}

export const gallery: GalleryItem[] = [
  { src: '/images/gallery/g1.png', alt: 'Torta de quince años de tres pisos en rosa con mariposas de azúcar', caption: 'Quinceañero de Valeria · Huamanga', orientation: 'portrait' },
  { src: '/images/gallery/g2.png', alt: 'Bandeja grande de bocaditos salados surtidos en una reunión familiar', caption: 'Reunión familiar · 200 bocaditos', orientation: 'landscape' },
  { src: '/images/gallery/g3.png', alt: 'Torta de chocolate con drip, macarons y topper dorado de 30 años', caption: 'Cumpleaños 30 de Diego', orientation: 'square' },
  { src: '/images/gallery/g4.png', alt: 'Torta de baby shower rosa con abejita de fondant y nubes', caption: 'Baby shower · temática abejita', orientation: 'portrait' },
  { src: '/images/gallery/g5.png', alt: 'Caja de cupcakes con frosting rosa y crema', caption: 'Cupcakes para la oficina', orientation: 'square' },
  { src: '/images/gallery/g6.png', alt: 'Mesa de postres para evento corporativo con mini cheesecakes y alfajores', caption: 'Evento corporativo · Ayacucho', orientation: 'landscape' },
  { src: '/images/gallery/g7.png', alt: 'Torta infantil temática de dinosaurios en verde y crema', caption: 'Cumple de Thiago · dinosaurios', orientation: 'portrait' },
  { src: '/images/gallery/g8.png', alt: 'Naked cake con frutos rojos y flores sobre mesa de madera', caption: 'Aniversario en el campo', orientation: 'landscape' },
]

export type Testimonial = {
  name: string
  occasion: string
  rating: number
  text: string
}

export const testimonials: Testimonial[] = [
  {
    name: 'Rosario Quispe',
    occasion: 'Cumpleaños de mi hija',
    rating: 5,
    text: 'La torta de abejita quedó idéntica a la foto que les mandé. Mi hija no quería que la cortáramos. Además, ¡estaba deliciosa!',
  },
  {
    name: 'Carlos Huamán',
    occasion: 'Reunión de trabajo',
    rating: 5,
    text: 'Pedí 200 bocaditos un viernes por la tarde y el sábado temprano ya estaban en la oficina. Los tequeños volaron.',
  },
  {
    name: 'Milagros Palomino',
    occasion: 'Matrimonio',
    rating: 5,
    text: 'Nos ayudaron a elegir sabores y diseño por WhatsApp sin ningún apuro. La torta fue el centro de atención de la boda.',
  },
  {
    name: 'Jorge Cárdenas',
    occasion: 'Aniversario',
    rating: 4,
    text: 'La tres leches es la mejor que he probado en Huamanga. Llegó puntual y bien empacada. Volveré a pedir.',
  },
  {
    name: 'Lucía Gutiérrez',
    occasion: 'Baby shower',
    rating: 5,
    text: 'La mesa dulce quedó preciosa y todo combinaba con la decoración. Los alfajores, una maravilla.',
  },
  {
    name: 'Fiorella Tineo',
    occasion: 'Día de la Madre',
    rating: 5,
    text: 'Encargué la torta floral para mi mamá y se emocionó muchísimo. Atención muy amable y rápida.',
  },
]

export const faqs = [
  {
    q: '¿Con cuánta anticipación debo pedir?',
    a: 'Para tortas clásicas y bocaditos, te recomendamos pedir con 2 a 3 días de anticipación. Para tortas personalizadas, mesas dulces y matrimonios, idealmente entre 1 y 2 semanas para asegurar tu fecha.',
  },
  {
    q: '¿Hacen productos sin azúcar o sin gluten?',
    a: 'Sí. Preparamos tortas endulzadas con stevia y algunas opciones sin gluten con harina de almendras. Trabajamos en una cocina compartida, por lo que no garantizamos ausencia total de trazas. Consúltanos por WhatsApp.',
  },
  {
    q: '¿Aceptan pedidos urgentes?',
    a: 'Según disponibilidad, aceptamos pedidos para el mismo día o el día siguiente de tortas clásicas y bocaditos. Escríbenos por WhatsApp y te confirmamos en minutos.',
  },
  {
    q: '¿Cómo conservar las tortas y bocaditos?',
    a: 'Mantén las tortas refrigeradas y sácalas 20 minutos antes de servir. Los bocaditos salados se disfrutan mejor el mismo día; si sobran, guárdalos en un recipiente hermético en refrigeración por hasta 2 días.',
  },
  {
    q: '¿Hacen delivery?',
    a: 'Sí, realizamos delivery en Huamanga, Carmen Alto, San Juan Bautista y Jesús Nazareno. El costo varía entre S/ 5 y S/ 10 según la zona. También puedes recoger tu pedido en nuestro taller.',
  },
  {
    q: '¿Cómo se realiza el pago?',
    a: 'Separamos tu pedido con el 50 % de adelanto por Yape, Plin o transferencia, y el saldo se cancela al momento de la entrega.',
  },
]
