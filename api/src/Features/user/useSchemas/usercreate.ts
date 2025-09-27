import type { Schema } from "req-valid-express";

const usercreate: Schema = {
  email: {
    type: "string",
    sanitize: {
      trim: true,
      escape: true
    }
  },
  username: {
    type: "string",
    sanitize: {
      trim: true,
      escape: true
    }
  },
  typeId: {
    type: "string",
    sanitize: {
      trim: true,
      escape: true
    }
  },
  numberId: {
    type: "string",
    sanitize: {
      trim: true,
      escape: true
    }
  },
  country: {
    type: "string",
    sanitize: {
      trim: true,
      escape: true
    }
  },
  role: {
    type: "string",
    default: "user",
    sanitize: {
      trim: true,
      escape: true
    }
  },
  picture: {
    type: "string",
    default: "https://urlimageprueba.net",
    sanitize: {
      trim: true
    }
  }
};

export default usercreate;
