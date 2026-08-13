import { SpecialistMetric } from "../types/hospital";

export const MOCK_SPECIALISTS: Record<string, SpecialistMetric[]> = {
  "hosp-1": [
    {
      "id": "spec-hosp-1-1",
      "specialty": "Cardiology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-1-2",
      "specialty": "Neurology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-1-3",
      "specialty": "Orthopedics",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-1-4",
      "specialty": "Emergency Medicine",
      "availableCount": 4,
      "status": "AVAILABLE"
    }
  ],
  "hosp-2": [
    {
      "id": "spec-hosp-2-1",
      "specialty": "Cardiology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-2-2",
      "specialty": "Neurology",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-2-3",
      "specialty": "Orthopedics",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-2-4",
      "specialty": "Emergency Medicine",
      "availableCount": 2,
      "status": "LIMITED"
    }
  ],
  "hosp-3": [
    {
      "id": "spec-hosp-3-1",
      "specialty": "Cardiology",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-3-2",
      "specialty": "Neurology",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-3-3",
      "specialty": "Orthopedics",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-3-4",
      "specialty": "Emergency Medicine",
      "availableCount": 1,
      "status": "LIMITED"
    }
  ],
  "hosp-4": [
    {
      "id": "spec-hosp-4-1",
      "specialty": "Cardiology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-4-2",
      "specialty": "Neurology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-4-3",
      "specialty": "Orthopedics",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-4-4",
      "specialty": "Emergency Medicine",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    }
  ],
  "hosp-5": [
    {
      "id": "spec-hosp-5-1",
      "specialty": "Cardiology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-5-2",
      "specialty": "Neurology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-5-3",
      "specialty": "Orthopedics",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-5-4",
      "specialty": "Emergency Medicine",
      "availableCount": 2,
      "status": "LIMITED"
    }
  ],
  "hosp-6": [
    {
      "id": "spec-hosp-6-1",
      "specialty": "Cardiology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-6-2",
      "specialty": "Neurology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-6-3",
      "specialty": "Orthopedics",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-6-4",
      "specialty": "Emergency Medicine",
      "availableCount": 3,
      "status": "AVAILABLE"
    }
  ],
  "hosp-7": [
    {
      "id": "spec-hosp-7-1",
      "specialty": "Cardiology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-7-2",
      "specialty": "Neurology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-7-3",
      "specialty": "Orthopedics",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-7-4",
      "specialty": "Emergency Medicine",
      "availableCount": 3,
      "status": "AVAILABLE"
    }
  ],
  "hosp-8": [
    {
      "id": "spec-hosp-8-1",
      "specialty": "Cardiology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-8-2",
      "specialty": "Neurology",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-8-3",
      "specialty": "Orthopedics",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-8-4",
      "specialty": "Emergency Medicine",
      "availableCount": 5,
      "status": "AVAILABLE"
    }
  ],
  "hosp-9": [
    {
      "id": "spec-hosp-9-1",
      "specialty": "Cardiology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-9-2",
      "specialty": "Neurology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-9-3",
      "specialty": "Orthopedics",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-9-4",
      "specialty": "Emergency Medicine",
      "availableCount": 5,
      "status": "AVAILABLE"
    }
  ],
  "hosp-10": [
    {
      "id": "spec-hosp-10-1",
      "specialty": "Cardiology",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-10-2",
      "specialty": "Neurology",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-10-3",
      "specialty": "Orthopedics",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-10-4",
      "specialty": "Emergency Medicine",
      "availableCount": 1,
      "status": "LIMITED"
    }
  ],
  "hosp-11": [
    {
      "id": "spec-hosp-11-1",
      "specialty": "Cardiology",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-11-2",
      "specialty": "Neurology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-11-3",
      "specialty": "Orthopedics",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-11-4",
      "specialty": "Emergency Medicine",
      "availableCount": 5,
      "status": "AVAILABLE"
    }
  ],
  "hosp-12": [
    {
      "id": "spec-hosp-12-1",
      "specialty": "Cardiology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-12-2",
      "specialty": "Neurology",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-12-3",
      "specialty": "Orthopedics",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-12-4",
      "specialty": "Emergency Medicine",
      "availableCount": 4,
      "status": "AVAILABLE"
    }
  ],
  "hosp-13": [
    {
      "id": "spec-hosp-13-1",
      "specialty": "Cardiology",
      "availableCount": 4,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-13-2",
      "specialty": "Neurology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-13-3",
      "specialty": "Orthopedics",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-13-4",
      "specialty": "Emergency Medicine",
      "availableCount": 5,
      "status": "AVAILABLE"
    }
  ],
  "hosp-14": [
    {
      "id": "spec-hosp-14-1",
      "specialty": "Cardiology",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-14-2",
      "specialty": "Neurology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-14-3",
      "specialty": "Orthopedics",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-14-4",
      "specialty": "Emergency Medicine",
      "availableCount": 4,
      "status": "AVAILABLE"
    }
  ],
  "hosp-15": [
    {
      "id": "spec-hosp-15-1",
      "specialty": "Cardiology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-15-2",
      "specialty": "Neurology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-15-3",
      "specialty": "Orthopedics",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-15-4",
      "specialty": "Emergency Medicine",
      "availableCount": 4,
      "status": "AVAILABLE"
    }
  ],
  "hosp-16": [
    {
      "id": "spec-hosp-16-1",
      "specialty": "Cardiology",
      "availableCount": 4,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-16-2",
      "specialty": "Neurology",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-16-3",
      "specialty": "Orthopedics",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-16-4",
      "specialty": "Emergency Medicine",
      "availableCount": 4,
      "status": "AVAILABLE"
    }
  ],
  "hosp-17": [
    {
      "id": "spec-hosp-17-1",
      "specialty": "Cardiology",
      "availableCount": 4,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-17-2",
      "specialty": "Neurology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-17-3",
      "specialty": "Orthopedics",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-17-4",
      "specialty": "Emergency Medicine",
      "availableCount": 5,
      "status": "AVAILABLE"
    }
  ],
  "hosp-18": [
    {
      "id": "spec-hosp-18-1",
      "specialty": "Cardiology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-18-2",
      "specialty": "Neurology",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-18-3",
      "specialty": "Orthopedics",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-18-4",
      "specialty": "Emergency Medicine",
      "availableCount": 2,
      "status": "LIMITED"
    }
  ],
  "hosp-19": [
    {
      "id": "spec-hosp-19-1",
      "specialty": "Cardiology",
      "availableCount": 4,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-19-2",
      "specialty": "Neurology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-19-3",
      "specialty": "Orthopedics",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-19-4",
      "specialty": "Emergency Medicine",
      "availableCount": 1,
      "status": "LIMITED"
    }
  ],
  "hosp-20": [
    {
      "id": "spec-hosp-20-1",
      "specialty": "Cardiology",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-20-2",
      "specialty": "Neurology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-20-3",
      "specialty": "Orthopedics",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-20-4",
      "specialty": "Emergency Medicine",
      "availableCount": 5,
      "status": "AVAILABLE"
    }
  ],
  "hosp-21": [
    {
      "id": "spec-hosp-21-1",
      "specialty": "Cardiology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-21-2",
      "specialty": "Neurology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-21-3",
      "specialty": "Orthopedics",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-21-4",
      "specialty": "Emergency Medicine",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    }
  ],
  "hosp-22": [
    {
      "id": "spec-hosp-22-1",
      "specialty": "Cardiology",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-22-2",
      "specialty": "Neurology",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-22-3",
      "specialty": "Orthopedics",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-22-4",
      "specialty": "Emergency Medicine",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    }
  ],
  "hosp-23": [
    {
      "id": "spec-hosp-23-1",
      "specialty": "Cardiology",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-23-2",
      "specialty": "Neurology",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-23-3",
      "specialty": "Orthopedics",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-23-4",
      "specialty": "Emergency Medicine",
      "availableCount": 4,
      "status": "AVAILABLE"
    }
  ],
  "hosp-24": [
    {
      "id": "spec-hosp-24-1",
      "specialty": "Cardiology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-24-2",
      "specialty": "Neurology",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-24-3",
      "specialty": "Orthopedics",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-24-4",
      "specialty": "Emergency Medicine",
      "availableCount": 2,
      "status": "LIMITED"
    }
  ],
  "hosp-25": [
    {
      "id": "spec-hosp-25-1",
      "specialty": "Cardiology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-25-2",
      "specialty": "Neurology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-25-3",
      "specialty": "Orthopedics",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-25-4",
      "specialty": "Emergency Medicine",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    }
  ],
  "hosp-26": [
    {
      "id": "spec-hosp-26-1",
      "specialty": "Cardiology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-26-2",
      "specialty": "Neurology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-26-3",
      "specialty": "Orthopedics",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-26-4",
      "specialty": "Emergency Medicine",
      "availableCount": 5,
      "status": "AVAILABLE"
    }
  ],
  "hosp-27": [
    {
      "id": "spec-hosp-27-1",
      "specialty": "Cardiology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-27-2",
      "specialty": "Neurology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-27-3",
      "specialty": "Orthopedics",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-27-4",
      "specialty": "Emergency Medicine",
      "availableCount": 2,
      "status": "LIMITED"
    }
  ],
  "hosp-28": [
    {
      "id": "spec-hosp-28-1",
      "specialty": "Cardiology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-28-2",
      "specialty": "Neurology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-28-3",
      "specialty": "Orthopedics",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-28-4",
      "specialty": "Emergency Medicine",
      "availableCount": 5,
      "status": "AVAILABLE"
    }
  ],
  "hosp-29": [
    {
      "id": "spec-hosp-29-1",
      "specialty": "Cardiology",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-29-2",
      "specialty": "Neurology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-29-3",
      "specialty": "Orthopedics",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-29-4",
      "specialty": "Emergency Medicine",
      "availableCount": 3,
      "status": "AVAILABLE"
    }
  ],
  "hosp-30": [
    {
      "id": "spec-hosp-30-1",
      "specialty": "Cardiology",
      "availableCount": 4,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-30-2",
      "specialty": "Neurology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-30-3",
      "specialty": "Orthopedics",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-30-4",
      "specialty": "Emergency Medicine",
      "availableCount": 3,
      "status": "AVAILABLE"
    }
  ],
  "hosp-31": [
    {
      "id": "spec-hosp-31-1",
      "specialty": "Cardiology",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-31-2",
      "specialty": "Neurology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-31-3",
      "specialty": "Orthopedics",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-31-4",
      "specialty": "Emergency Medicine",
      "availableCount": 2,
      "status": "LIMITED"
    }
  ],
  "hosp-32": [
    {
      "id": "spec-hosp-32-1",
      "specialty": "Cardiology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-32-2",
      "specialty": "Neurology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-32-3",
      "specialty": "Orthopedics",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-32-4",
      "specialty": "Emergency Medicine",
      "availableCount": 1,
      "status": "LIMITED"
    }
  ],
  "hosp-33": [
    {
      "id": "spec-hosp-33-1",
      "specialty": "Cardiology",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-33-2",
      "specialty": "Neurology",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-33-3",
      "specialty": "Orthopedics",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-33-4",
      "specialty": "Emergency Medicine",
      "availableCount": 2,
      "status": "LIMITED"
    }
  ],
  "hosp-34": [
    {
      "id": "spec-hosp-34-1",
      "specialty": "Cardiology",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-34-2",
      "specialty": "Neurology",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-34-3",
      "specialty": "Orthopedics",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-34-4",
      "specialty": "Emergency Medicine",
      "availableCount": 2,
      "status": "LIMITED"
    }
  ],
  "hosp-35": [
    {
      "id": "spec-hosp-35-1",
      "specialty": "Cardiology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-35-2",
      "specialty": "Neurology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-35-3",
      "specialty": "Orthopedics",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-35-4",
      "specialty": "Emergency Medicine",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    }
  ],
  "hosp-36": [
    {
      "id": "spec-hosp-36-1",
      "specialty": "Cardiology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-36-2",
      "specialty": "Neurology",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-36-3",
      "specialty": "Orthopedics",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-36-4",
      "specialty": "Emergency Medicine",
      "availableCount": 2,
      "status": "LIMITED"
    }
  ],
  "hosp-37": [
    {
      "id": "spec-hosp-37-1",
      "specialty": "Cardiology",
      "availableCount": 4,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-37-2",
      "specialty": "Neurology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-37-3",
      "specialty": "Orthopedics",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-37-4",
      "specialty": "Emergency Medicine",
      "availableCount": 5,
      "status": "AVAILABLE"
    }
  ],
  "hosp-38": [
    {
      "id": "spec-hosp-38-1",
      "specialty": "Cardiology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-38-2",
      "specialty": "Neurology",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-38-3",
      "specialty": "Orthopedics",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-38-4",
      "specialty": "Emergency Medicine",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    }
  ],
  "hosp-39": [
    {
      "id": "spec-hosp-39-1",
      "specialty": "Cardiology",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-39-2",
      "specialty": "Neurology",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-39-3",
      "specialty": "Orthopedics",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-39-4",
      "specialty": "Emergency Medicine",
      "availableCount": 5,
      "status": "AVAILABLE"
    }
  ],
  "hosp-40": [
    {
      "id": "spec-hosp-40-1",
      "specialty": "Cardiology",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-40-2",
      "specialty": "Neurology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-40-3",
      "specialty": "Orthopedics",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-40-4",
      "specialty": "Emergency Medicine",
      "availableCount": 4,
      "status": "AVAILABLE"
    }
  ],
  "hosp-41": [
    {
      "id": "spec-hosp-41-1",
      "specialty": "Cardiology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-41-2",
      "specialty": "Neurology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-41-3",
      "specialty": "Orthopedics",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-41-4",
      "specialty": "Emergency Medicine",
      "availableCount": 5,
      "status": "AVAILABLE"
    }
  ],
  "hosp-42": [
    {
      "id": "spec-hosp-42-1",
      "specialty": "Cardiology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-42-2",
      "specialty": "Neurology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-42-3",
      "specialty": "Orthopedics",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-42-4",
      "specialty": "Emergency Medicine",
      "availableCount": 1,
      "status": "LIMITED"
    }
  ],
  "hosp-43": [
    {
      "id": "spec-hosp-43-1",
      "specialty": "Cardiology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-43-2",
      "specialty": "Neurology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-43-3",
      "specialty": "Orthopedics",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-43-4",
      "specialty": "Emergency Medicine",
      "availableCount": 1,
      "status": "LIMITED"
    }
  ],
  "hosp-44": [
    {
      "id": "spec-hosp-44-1",
      "specialty": "Cardiology",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-44-2",
      "specialty": "Neurology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-44-3",
      "specialty": "Orthopedics",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-44-4",
      "specialty": "Emergency Medicine",
      "availableCount": 2,
      "status": "LIMITED"
    }
  ],
  "hosp-45": [
    {
      "id": "spec-hosp-45-1",
      "specialty": "Cardiology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-45-2",
      "specialty": "Neurology",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-45-3",
      "specialty": "Orthopedics",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-45-4",
      "specialty": "Emergency Medicine",
      "availableCount": 1,
      "status": "LIMITED"
    }
  ],
  "hosp-46": [
    {
      "id": "spec-hosp-46-1",
      "specialty": "Cardiology",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-46-2",
      "specialty": "Neurology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-46-3",
      "specialty": "Orthopedics",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-46-4",
      "specialty": "Emergency Medicine",
      "availableCount": 2,
      "status": "LIMITED"
    }
  ],
  "hosp-47": [
    {
      "id": "spec-hosp-47-1",
      "specialty": "Cardiology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-47-2",
      "specialty": "Neurology",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-47-3",
      "specialty": "Orthopedics",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-47-4",
      "specialty": "Emergency Medicine",
      "availableCount": 3,
      "status": "AVAILABLE"
    }
  ],
  "hosp-48": [
    {
      "id": "spec-hosp-48-1",
      "specialty": "Cardiology",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-48-2",
      "specialty": "Neurology",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-48-3",
      "specialty": "Orthopedics",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-48-4",
      "specialty": "Emergency Medicine",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    }
  ],
  "hosp-49": [
    {
      "id": "spec-hosp-49-1",
      "specialty": "Cardiology",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-49-2",
      "specialty": "Neurology",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-49-3",
      "specialty": "Orthopedics",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-49-4",
      "specialty": "Emergency Medicine",
      "availableCount": 5,
      "status": "AVAILABLE"
    }
  ],
  "hosp-50": [
    {
      "id": "spec-hosp-50-1",
      "specialty": "Cardiology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-50-2",
      "specialty": "Neurology",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-50-3",
      "specialty": "Orthopedics",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-50-4",
      "specialty": "Emergency Medicine",
      "availableCount": 3,
      "status": "AVAILABLE"
    }
  ],
  "hosp-51": [
    {
      "id": "spec-hosp-51-1",
      "specialty": "Cardiology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-51-2",
      "specialty": "Neurology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-51-3",
      "specialty": "Orthopedics",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-51-4",
      "specialty": "Emergency Medicine",
      "availableCount": 1,
      "status": "LIMITED"
    }
  ],
  "hosp-52": [
    {
      "id": "spec-hosp-52-1",
      "specialty": "Cardiology",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-52-2",
      "specialty": "Neurology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-52-3",
      "specialty": "Orthopedics",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-52-4",
      "specialty": "Emergency Medicine",
      "availableCount": 4,
      "status": "AVAILABLE"
    }
  ],
  "hosp-53": [
    {
      "id": "spec-hosp-53-1",
      "specialty": "Cardiology",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-53-2",
      "specialty": "Neurology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-53-3",
      "specialty": "Orthopedics",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-53-4",
      "specialty": "Emergency Medicine",
      "availableCount": 3,
      "status": "AVAILABLE"
    }
  ],
  "hosp-54": [
    {
      "id": "spec-hosp-54-1",
      "specialty": "Cardiology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-54-2",
      "specialty": "Neurology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-54-3",
      "specialty": "Orthopedics",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-54-4",
      "specialty": "Emergency Medicine",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    }
  ],
  "hosp-55": [
    {
      "id": "spec-hosp-55-1",
      "specialty": "Cardiology",
      "availableCount": 4,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-55-2",
      "specialty": "Neurology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-55-3",
      "specialty": "Orthopedics",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-55-4",
      "specialty": "Emergency Medicine",
      "availableCount": 1,
      "status": "LIMITED"
    }
  ],
  "hosp-56": [
    {
      "id": "spec-hosp-56-1",
      "specialty": "Cardiology",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-56-2",
      "specialty": "Neurology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-56-3",
      "specialty": "Orthopedics",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-56-4",
      "specialty": "Emergency Medicine",
      "availableCount": 1,
      "status": "LIMITED"
    }
  ],
  "hosp-57": [
    {
      "id": "spec-hosp-57-1",
      "specialty": "Cardiology",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-57-2",
      "specialty": "Neurology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-57-3",
      "specialty": "Orthopedics",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-57-4",
      "specialty": "Emergency Medicine",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    }
  ],
  "hosp-58": [
    {
      "id": "spec-hosp-58-1",
      "specialty": "Cardiology",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-58-2",
      "specialty": "Neurology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-58-3",
      "specialty": "Orthopedics",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-58-4",
      "specialty": "Emergency Medicine",
      "availableCount": 3,
      "status": "AVAILABLE"
    }
  ],
  "hosp-59": [
    {
      "id": "spec-hosp-59-1",
      "specialty": "Cardiology",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-59-2",
      "specialty": "Neurology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-59-3",
      "specialty": "Orthopedics",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-59-4",
      "specialty": "Emergency Medicine",
      "availableCount": 2,
      "status": "LIMITED"
    }
  ],
  "hosp-60": [
    {
      "id": "spec-hosp-60-1",
      "specialty": "Cardiology",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-60-2",
      "specialty": "Neurology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-60-3",
      "specialty": "Orthopedics",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-60-4",
      "specialty": "Emergency Medicine",
      "availableCount": 3,
      "status": "AVAILABLE"
    }
  ],
  "hosp-61": [
    {
      "id": "spec-hosp-61-1",
      "specialty": "Cardiology",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-61-2",
      "specialty": "Neurology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-61-3",
      "specialty": "Orthopedics",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-61-4",
      "specialty": "Emergency Medicine",
      "availableCount": 1,
      "status": "LIMITED"
    }
  ],
  "hosp-62": [
    {
      "id": "spec-hosp-62-1",
      "specialty": "Cardiology",
      "availableCount": 4,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-62-2",
      "specialty": "Neurology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-62-3",
      "specialty": "Orthopedics",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-62-4",
      "specialty": "Emergency Medicine",
      "availableCount": 3,
      "status": "AVAILABLE"
    }
  ],
  "hosp-63": [
    {
      "id": "spec-hosp-63-1",
      "specialty": "Cardiology",
      "availableCount": 4,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-63-2",
      "specialty": "Neurology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-63-3",
      "specialty": "Orthopedics",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-63-4",
      "specialty": "Emergency Medicine",
      "availableCount": 3,
      "status": "AVAILABLE"
    }
  ],
  "hosp-64": [
    {
      "id": "spec-hosp-64-1",
      "specialty": "Cardiology",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-64-2",
      "specialty": "Neurology",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-64-3",
      "specialty": "Orthopedics",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-64-4",
      "specialty": "Emergency Medicine",
      "availableCount": 4,
      "status": "AVAILABLE"
    }
  ],
  "hosp-65": [
    {
      "id": "spec-hosp-65-1",
      "specialty": "Cardiology",
      "availableCount": 4,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-65-2",
      "specialty": "Neurology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-65-3",
      "specialty": "Orthopedics",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-65-4",
      "specialty": "Emergency Medicine",
      "availableCount": 3,
      "status": "AVAILABLE"
    }
  ],
  "hosp-66": [
    {
      "id": "spec-hosp-66-1",
      "specialty": "Cardiology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-66-2",
      "specialty": "Neurology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-66-3",
      "specialty": "Orthopedics",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-66-4",
      "specialty": "Emergency Medicine",
      "availableCount": 4,
      "status": "AVAILABLE"
    }
  ],
  "hosp-67": [
    {
      "id": "spec-hosp-67-1",
      "specialty": "Cardiology",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-67-2",
      "specialty": "Neurology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-67-3",
      "specialty": "Orthopedics",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-67-4",
      "specialty": "Emergency Medicine",
      "availableCount": 1,
      "status": "LIMITED"
    }
  ],
  "hosp-68": [
    {
      "id": "spec-hosp-68-1",
      "specialty": "Cardiology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-68-2",
      "specialty": "Neurology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-68-3",
      "specialty": "Orthopedics",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-68-4",
      "specialty": "Emergency Medicine",
      "availableCount": 2,
      "status": "LIMITED"
    }
  ],
  "hosp-69": [
    {
      "id": "spec-hosp-69-1",
      "specialty": "Cardiology",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-69-2",
      "specialty": "Neurology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-69-3",
      "specialty": "Orthopedics",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-69-4",
      "specialty": "Emergency Medicine",
      "availableCount": 4,
      "status": "AVAILABLE"
    }
  ],
  "hosp-70": [
    {
      "id": "spec-hosp-70-1",
      "specialty": "Cardiology",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-70-2",
      "specialty": "Neurology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-70-3",
      "specialty": "Orthopedics",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-70-4",
      "specialty": "Emergency Medicine",
      "availableCount": 4,
      "status": "AVAILABLE"
    }
  ],
  "hosp-71": [
    {
      "id": "spec-hosp-71-1",
      "specialty": "Cardiology",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-71-2",
      "specialty": "Neurology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-71-3",
      "specialty": "Orthopedics",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-71-4",
      "specialty": "Emergency Medicine",
      "availableCount": 1,
      "status": "LIMITED"
    }
  ],
  "hosp-72": [
    {
      "id": "spec-hosp-72-1",
      "specialty": "Cardiology",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-72-2",
      "specialty": "Neurology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-72-3",
      "specialty": "Orthopedics",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-72-4",
      "specialty": "Emergency Medicine",
      "availableCount": 2,
      "status": "LIMITED"
    }
  ],
  "hosp-73": [
    {
      "id": "spec-hosp-73-1",
      "specialty": "Cardiology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-73-2",
      "specialty": "Neurology",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-73-3",
      "specialty": "Orthopedics",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-73-4",
      "specialty": "Emergency Medicine",
      "availableCount": 1,
      "status": "LIMITED"
    }
  ],
  "hosp-74": [
    {
      "id": "spec-hosp-74-1",
      "specialty": "Cardiology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-74-2",
      "specialty": "Neurology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-74-3",
      "specialty": "Orthopedics",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-74-4",
      "specialty": "Emergency Medicine",
      "availableCount": 4,
      "status": "AVAILABLE"
    }
  ],
  "hosp-75": [
    {
      "id": "spec-hosp-75-1",
      "specialty": "Cardiology",
      "availableCount": 4,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-75-2",
      "specialty": "Neurology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-75-3",
      "specialty": "Orthopedics",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-75-4",
      "specialty": "Emergency Medicine",
      "availableCount": 4,
      "status": "AVAILABLE"
    }
  ],
  "hosp-76": [
    {
      "id": "spec-hosp-76-1",
      "specialty": "Cardiology",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-76-2",
      "specialty": "Neurology",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-76-3",
      "specialty": "Orthopedics",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-76-4",
      "specialty": "Emergency Medicine",
      "availableCount": 3,
      "status": "AVAILABLE"
    }
  ],
  "hosp-77": [
    {
      "id": "spec-hosp-77-1",
      "specialty": "Cardiology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-77-2",
      "specialty": "Neurology",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-77-3",
      "specialty": "Orthopedics",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-77-4",
      "specialty": "Emergency Medicine",
      "availableCount": 1,
      "status": "LIMITED"
    }
  ],
  "hosp-78": [
    {
      "id": "spec-hosp-78-1",
      "specialty": "Cardiology",
      "availableCount": 4,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-78-2",
      "specialty": "Neurology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-78-3",
      "specialty": "Orthopedics",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-78-4",
      "specialty": "Emergency Medicine",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    }
  ],
  "hosp-79": [
    {
      "id": "spec-hosp-79-1",
      "specialty": "Cardiology",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-79-2",
      "specialty": "Neurology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-79-3",
      "specialty": "Orthopedics",
      "availableCount": 2,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-79-4",
      "specialty": "Emergency Medicine",
      "availableCount": 1,
      "status": "LIMITED"
    }
  ],
  "hosp-80": [
    {
      "id": "spec-hosp-80-1",
      "specialty": "Cardiology",
      "availableCount": 1,
      "status": "LIMITED"
    },
    {
      "id": "spec-hosp-80-2",
      "specialty": "Neurology",
      "availableCount": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "spec-hosp-80-3",
      "specialty": "Orthopedics",
      "availableCount": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "spec-hosp-80-4",
      "specialty": "Emergency Medicine",
      "availableCount": 4,
      "status": "AVAILABLE"
    }
  ]
};