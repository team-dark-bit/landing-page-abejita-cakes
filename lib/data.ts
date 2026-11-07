export const business = {
  name: 'Abejita Cakes',
  whatsappNumber: '51902106328',
  whatsappDisplay: '+51 902 106 328',
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
