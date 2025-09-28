import type { Schema } from 'req-valid-express'

const usercreate: Schema = {
  email: {
    type: 'string',
    sanitize: {
      trim: true,
      escape: true
    }
  },
  username: {
    type: 'string',
    sanitize: {
      trim: true,
      escape: true
    }
  },
  typeId: {
    type: 'string',
    sanitize: {
      trim: true,
      escape: true,
      uppercase: true
    }
  },
  numberId: {
    type: 'string',
    sanitize: {
      trim: true,
      escape: true
    }
  },
  country: {
    type: 'string',
    sanitize: {
      trim: true,
      escape: true,
      lowercase: true
    }
  },
  picture: {
    type: 'string',
    default: 'https://urlimageprueba.net',
    sanitize: {
      trim: true
    }
  }
}

export default usercreate
