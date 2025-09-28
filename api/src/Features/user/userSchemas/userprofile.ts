import type { Schema } from 'req-valid-express'

const userprofile: Schema = {
  email: {
    type: 'string',
    sanitize: {
      trim: true,
      escape: true
    }
  },
  nickname: {
    type: 'string',
    sanitize: {
      trim: true
    }
  },
  username: {
    type: 'string',
    sanitize: {
      trim: true
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

export default userprofile
