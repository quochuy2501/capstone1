export const PublicRoutes = [
  {
    path: '/sign-in',
    component: 'sign-in'
  },
  {
    path: '/sign-up',
    component: 'sign-up'
  }
];

export const PrivateRoutes = [
  {
    path: '/',
    component: 'home'
  },
  {
    path: '/pitch-detail/:id',
    component: 'pitch-detail'
  },
  {
    path: '/confirm-payment',
    component: 'confirm-payment'
  },
  {
    path: '/payment-success',
    component: 'payment-success'
  },
  {
    path: '/payment-failed',
    component: 'payment-failed'
  },
  {
    path: '/history',
    component: 'history'
  },
  {
    path: '/booked-schedule',
    component: 'booked-schedule'
  }
];