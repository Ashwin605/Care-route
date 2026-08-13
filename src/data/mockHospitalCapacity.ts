import { CapacityMetric } from "../types/hospital";

export const MOCK_CAPACITY: Record<string, CapacityMetric[]> = {
  "hosp-1": [
    {
      "id": "cap-hosp-1-1",
      "name": "ICU",
      "total": 20,
      "occupied": 7,
      "available": 13,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-1-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 0,
      "available": 10,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-1-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 104,
      "available": 46,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-1-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-2": [
    {
      "id": "cap-hosp-2-1",
      "name": "ICU",
      "total": 20,
      "occupied": 1,
      "available": 19,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-2-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 3,
      "available": 7,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-2-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 139,
      "available": 11,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-2-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-3": [
    {
      "id": "cap-hosp-3-1",
      "name": "ICU",
      "total": 20,
      "occupied": 6,
      "available": 14,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-3-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 10,
      "available": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "cap-hosp-3-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 105,
      "available": 45,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-3-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-4": [
    {
      "id": "cap-hosp-4-1",
      "name": "ICU",
      "total": 20,
      "occupied": 19,
      "available": 1,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-4-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 6,
      "available": 4,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-4-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 75,
      "available": 75,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-4-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-5": [
    {
      "id": "cap-hosp-5-1",
      "name": "ICU",
      "total": 20,
      "occupied": 11,
      "available": 9,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-5-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 6,
      "available": 4,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-5-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 61,
      "available": 89,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-5-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-6": [
    {
      "id": "cap-hosp-6-1",
      "name": "ICU",
      "total": 20,
      "occupied": 17,
      "available": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-6-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 10,
      "available": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "cap-hosp-6-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 64,
      "available": 86,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-6-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-7": [
    {
      "id": "cap-hosp-7-1",
      "name": "ICU",
      "total": 20,
      "occupied": 10,
      "available": 10,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-7-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 3,
      "available": 7,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-7-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 102,
      "available": 48,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-7-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-8": [
    {
      "id": "cap-hosp-8-1",
      "name": "ICU",
      "total": 20,
      "occupied": 13,
      "available": 7,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-8-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 8,
      "available": 2,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-8-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 145,
      "available": 5,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-8-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-9": [
    {
      "id": "cap-hosp-9-1",
      "name": "ICU",
      "total": 20,
      "occupied": 6,
      "available": 14,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-9-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 10,
      "available": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "cap-hosp-9-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 23,
      "available": 127,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-9-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-10": [
    {
      "id": "cap-hosp-10-1",
      "name": "ICU",
      "total": 20,
      "occupied": 14,
      "available": 6,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-10-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 7,
      "available": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-10-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 67,
      "available": 83,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-10-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-11": [
    {
      "id": "cap-hosp-11-1",
      "name": "ICU",
      "total": 20,
      "occupied": 3,
      "available": 17,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-11-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 2,
      "available": 8,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-11-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 18,
      "available": 132,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-11-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-12": [
    {
      "id": "cap-hosp-12-1",
      "name": "ICU",
      "total": 20,
      "occupied": 10,
      "available": 10,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-12-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 4,
      "available": 6,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-12-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 33,
      "available": 117,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-12-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-13": [
    {
      "id": "cap-hosp-13-1",
      "name": "ICU",
      "total": 20,
      "occupied": 15,
      "available": 5,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-13-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 10,
      "available": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "cap-hosp-13-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 65,
      "available": 85,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-13-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-14": [
    {
      "id": "cap-hosp-14-1",
      "name": "ICU",
      "total": 20,
      "occupied": 15,
      "available": 5,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-14-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 5,
      "available": 5,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-14-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 7,
      "available": 143,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-14-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "LIMITED"
    }
  ],
  "hosp-15": [
    {
      "id": "cap-hosp-15-1",
      "name": "ICU",
      "total": 20,
      "occupied": 12,
      "available": 8,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-15-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 0,
      "available": 10,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-15-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 3,
      "available": 147,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-15-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-16": [
    {
      "id": "cap-hosp-16-1",
      "name": "ICU",
      "total": 20,
      "occupied": 8,
      "available": 12,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-16-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 4,
      "available": 6,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-16-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 140,
      "available": 10,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-16-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-17": [
    {
      "id": "cap-hosp-17-1",
      "name": "ICU",
      "total": 20,
      "occupied": 4,
      "available": 16,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-17-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 2,
      "available": 8,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-17-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 141,
      "available": 9,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-17-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-18": [
    {
      "id": "cap-hosp-18-1",
      "name": "ICU",
      "total": 20,
      "occupied": 18,
      "available": 2,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-18-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 6,
      "available": 4,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-18-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 119,
      "available": 31,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-18-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-19": [
    {
      "id": "cap-hosp-19-1",
      "name": "ICU",
      "total": 20,
      "occupied": 20,
      "available": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "cap-hosp-19-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 3,
      "available": 7,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-19-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 39,
      "available": 111,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-19-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-20": [
    {
      "id": "cap-hosp-20-1",
      "name": "ICU",
      "total": 20,
      "occupied": 0,
      "available": 20,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-20-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 9,
      "available": 1,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-20-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 60,
      "available": 90,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-20-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-21": [
    {
      "id": "cap-hosp-21-1",
      "name": "ICU",
      "total": 20,
      "occupied": 5,
      "available": 15,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-21-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 2,
      "available": 8,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-21-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 48,
      "available": 102,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-21-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-22": [
    {
      "id": "cap-hosp-22-1",
      "name": "ICU",
      "total": 20,
      "occupied": 7,
      "available": 13,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-22-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 7,
      "available": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-22-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 64,
      "available": 86,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-22-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-23": [
    {
      "id": "cap-hosp-23-1",
      "name": "ICU",
      "total": 20,
      "occupied": 18,
      "available": 2,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-23-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 0,
      "available": 10,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-23-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 122,
      "available": 28,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-23-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "LIMITED"
    }
  ],
  "hosp-24": [
    {
      "id": "cap-hosp-24-1",
      "name": "ICU",
      "total": 20,
      "occupied": 17,
      "available": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-24-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 0,
      "available": 10,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-24-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 81,
      "available": 69,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-24-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-25": [
    {
      "id": "cap-hosp-25-1",
      "name": "ICU",
      "total": 20,
      "occupied": 1,
      "available": 19,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-25-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 0,
      "available": 10,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-25-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 44,
      "available": 106,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-25-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "LIMITED"
    }
  ],
  "hosp-26": [
    {
      "id": "cap-hosp-26-1",
      "name": "ICU",
      "total": 20,
      "occupied": 16,
      "available": 4,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-26-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 0,
      "available": 10,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-26-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 99,
      "available": 51,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-26-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-27": [
    {
      "id": "cap-hosp-27-1",
      "name": "ICU",
      "total": 20,
      "occupied": 2,
      "available": 18,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-27-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 3,
      "available": 7,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-27-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 101,
      "available": 49,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-27-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "LIMITED"
    }
  ],
  "hosp-28": [
    {
      "id": "cap-hosp-28-1",
      "name": "ICU",
      "total": 20,
      "occupied": 17,
      "available": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-28-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 3,
      "available": 7,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-28-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 85,
      "available": 65,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-28-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-29": [
    {
      "id": "cap-hosp-29-1",
      "name": "ICU",
      "total": 20,
      "occupied": 3,
      "available": 17,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-29-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 2,
      "available": 8,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-29-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 86,
      "available": 64,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-29-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-30": [
    {
      "id": "cap-hosp-30-1",
      "name": "ICU",
      "total": 20,
      "occupied": 9,
      "available": 11,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-30-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 8,
      "available": 2,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-30-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 7,
      "available": 143,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-30-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-31": [
    {
      "id": "cap-hosp-31-1",
      "name": "ICU",
      "total": 20,
      "occupied": 16,
      "available": 4,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-31-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 0,
      "available": 10,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-31-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 140,
      "available": 10,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-31-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "LIMITED"
    }
  ],
  "hosp-32": [
    {
      "id": "cap-hosp-32-1",
      "name": "ICU",
      "total": 20,
      "occupied": 15,
      "available": 5,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-32-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 0,
      "available": 10,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-32-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 29,
      "available": 121,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-32-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-33": [
    {
      "id": "cap-hosp-33-1",
      "name": "ICU",
      "total": 20,
      "occupied": 13,
      "available": 7,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-33-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 0,
      "available": 10,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-33-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 21,
      "available": 129,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-33-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-34": [
    {
      "id": "cap-hosp-34-1",
      "name": "ICU",
      "total": 20,
      "occupied": 15,
      "available": 5,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-34-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 1,
      "available": 9,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-34-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 19,
      "available": 131,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-34-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-35": [
    {
      "id": "cap-hosp-35-1",
      "name": "ICU",
      "total": 20,
      "occupied": 16,
      "available": 4,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-35-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 10,
      "available": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "cap-hosp-35-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 79,
      "available": 71,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-35-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-36": [
    {
      "id": "cap-hosp-36-1",
      "name": "ICU",
      "total": 20,
      "occupied": 0,
      "available": 20,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-36-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 3,
      "available": 7,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-36-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 4,
      "available": 146,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-36-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-37": [
    {
      "id": "cap-hosp-37-1",
      "name": "ICU",
      "total": 20,
      "occupied": 18,
      "available": 2,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-37-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 5,
      "available": 5,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-37-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 78,
      "available": 72,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-37-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-38": [
    {
      "id": "cap-hosp-38-1",
      "name": "ICU",
      "total": 20,
      "occupied": 15,
      "available": 5,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-38-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 4,
      "available": 6,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-38-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 109,
      "available": 41,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-38-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-39": [
    {
      "id": "cap-hosp-39-1",
      "name": "ICU",
      "total": 20,
      "occupied": 13,
      "available": 7,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-39-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 8,
      "available": 2,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-39-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 93,
      "available": 57,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-39-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-40": [
    {
      "id": "cap-hosp-40-1",
      "name": "ICU",
      "total": 20,
      "occupied": 12,
      "available": 8,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-40-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 4,
      "available": 6,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-40-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 95,
      "available": 55,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-40-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-41": [
    {
      "id": "cap-hosp-41-1",
      "name": "ICU",
      "total": 20,
      "occupied": 17,
      "available": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-41-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 4,
      "available": 6,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-41-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 143,
      "available": 7,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-41-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-42": [
    {
      "id": "cap-hosp-42-1",
      "name": "ICU",
      "total": 20,
      "occupied": 18,
      "available": 2,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-42-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 6,
      "available": 4,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-42-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 104,
      "available": 46,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-42-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-43": [
    {
      "id": "cap-hosp-43-1",
      "name": "ICU",
      "total": 20,
      "occupied": 15,
      "available": 5,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-43-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 9,
      "available": 1,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-43-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 42,
      "available": 108,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-43-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-44": [
    {
      "id": "cap-hosp-44-1",
      "name": "ICU",
      "total": 20,
      "occupied": 14,
      "available": 6,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-44-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 1,
      "available": 9,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-44-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 110,
      "available": 40,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-44-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-45": [
    {
      "id": "cap-hosp-45-1",
      "name": "ICU",
      "total": 20,
      "occupied": 2,
      "available": 18,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-45-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 5,
      "available": 5,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-45-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 68,
      "available": 82,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-45-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-46": [
    {
      "id": "cap-hosp-46-1",
      "name": "ICU",
      "total": 20,
      "occupied": 5,
      "available": 15,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-46-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 3,
      "available": 7,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-46-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 25,
      "available": 125,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-46-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-47": [
    {
      "id": "cap-hosp-47-1",
      "name": "ICU",
      "total": 20,
      "occupied": 7,
      "available": 13,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-47-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 5,
      "available": 5,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-47-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 104,
      "available": 46,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-47-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-48": [
    {
      "id": "cap-hosp-48-1",
      "name": "ICU",
      "total": 20,
      "occupied": 0,
      "available": 20,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-48-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 5,
      "available": 5,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-48-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 105,
      "available": 45,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-48-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-49": [
    {
      "id": "cap-hosp-49-1",
      "name": "ICU",
      "total": 20,
      "occupied": 9,
      "available": 11,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-49-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 2,
      "available": 8,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-49-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 109,
      "available": 41,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-49-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-50": [
    {
      "id": "cap-hosp-50-1",
      "name": "ICU",
      "total": 20,
      "occupied": 19,
      "available": 1,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-50-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 9,
      "available": 1,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-50-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 130,
      "available": 20,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-50-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-51": [
    {
      "id": "cap-hosp-51-1",
      "name": "ICU",
      "total": 20,
      "occupied": 15,
      "available": 5,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-51-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 5,
      "available": 5,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-51-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 25,
      "available": 125,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-51-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-52": [
    {
      "id": "cap-hosp-52-1",
      "name": "ICU",
      "total": 20,
      "occupied": 1,
      "available": 19,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-52-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 2,
      "available": 8,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-52-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 51,
      "available": 99,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-52-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-53": [
    {
      "id": "cap-hosp-53-1",
      "name": "ICU",
      "total": 20,
      "occupied": 10,
      "available": 10,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-53-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 0,
      "available": 10,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-53-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 78,
      "available": 72,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-53-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-54": [
    {
      "id": "cap-hosp-54-1",
      "name": "ICU",
      "total": 20,
      "occupied": 0,
      "available": 20,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-54-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 5,
      "available": 5,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-54-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 140,
      "available": 10,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-54-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-55": [
    {
      "id": "cap-hosp-55-1",
      "name": "ICU",
      "total": 20,
      "occupied": 9,
      "available": 11,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-55-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 5,
      "available": 5,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-55-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 100,
      "available": 50,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-55-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-56": [
    {
      "id": "cap-hosp-56-1",
      "name": "ICU",
      "total": 20,
      "occupied": 4,
      "available": 16,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-56-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 10,
      "available": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "cap-hosp-56-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 114,
      "available": 36,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-56-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-57": [
    {
      "id": "cap-hosp-57-1",
      "name": "ICU",
      "total": 20,
      "occupied": 0,
      "available": 20,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-57-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 6,
      "available": 4,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-57-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 39,
      "available": 111,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-57-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-58": [
    {
      "id": "cap-hosp-58-1",
      "name": "ICU",
      "total": 20,
      "occupied": 15,
      "available": 5,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-58-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 1,
      "available": 9,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-58-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 26,
      "available": 124,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-58-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "LIMITED"
    }
  ],
  "hosp-59": [
    {
      "id": "cap-hosp-59-1",
      "name": "ICU",
      "total": 20,
      "occupied": 4,
      "available": 16,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-59-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 7,
      "available": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-59-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 16,
      "available": 134,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-59-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "LIMITED"
    }
  ],
  "hosp-60": [
    {
      "id": "cap-hosp-60-1",
      "name": "ICU",
      "total": 20,
      "occupied": 17,
      "available": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-60-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 0,
      "available": 10,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-60-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 120,
      "available": 30,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-60-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "LIMITED"
    }
  ],
  "hosp-61": [
    {
      "id": "cap-hosp-61-1",
      "name": "ICU",
      "total": 20,
      "occupied": 6,
      "available": 14,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-61-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 1,
      "available": 9,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-61-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 61,
      "available": 89,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-61-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-62": [
    {
      "id": "cap-hosp-62-1",
      "name": "ICU",
      "total": 20,
      "occupied": 3,
      "available": 17,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-62-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 4,
      "available": 6,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-62-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 20,
      "available": 130,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-62-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-63": [
    {
      "id": "cap-hosp-63-1",
      "name": "ICU",
      "total": 20,
      "occupied": 19,
      "available": 1,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-63-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 10,
      "available": 0,
      "status": "UNAVAILABLE"
    },
    {
      "id": "cap-hosp-63-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 108,
      "available": 42,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-63-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "LIMITED"
    }
  ],
  "hosp-64": [
    {
      "id": "cap-hosp-64-1",
      "name": "ICU",
      "total": 20,
      "occupied": 7,
      "available": 13,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-64-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 5,
      "available": 5,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-64-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 24,
      "available": 126,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-64-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-65": [
    {
      "id": "cap-hosp-65-1",
      "name": "ICU",
      "total": 20,
      "occupied": 2,
      "available": 18,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-65-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 8,
      "available": 2,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-65-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 37,
      "available": 113,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-65-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-66": [
    {
      "id": "cap-hosp-66-1",
      "name": "ICU",
      "total": 20,
      "occupied": 11,
      "available": 9,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-66-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 1,
      "available": 9,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-66-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 62,
      "available": 88,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-66-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-67": [
    {
      "id": "cap-hosp-67-1",
      "name": "ICU",
      "total": 20,
      "occupied": 0,
      "available": 20,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-67-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 1,
      "available": 9,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-67-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 79,
      "available": 71,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-67-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "LIMITED"
    }
  ],
  "hosp-68": [
    {
      "id": "cap-hosp-68-1",
      "name": "ICU",
      "total": 20,
      "occupied": 12,
      "available": 8,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-68-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 1,
      "available": 9,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-68-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 102,
      "available": 48,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-68-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-69": [
    {
      "id": "cap-hosp-69-1",
      "name": "ICU",
      "total": 20,
      "occupied": 8,
      "available": 12,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-69-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 8,
      "available": 2,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-69-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 144,
      "available": 6,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-69-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-70": [
    {
      "id": "cap-hosp-70-1",
      "name": "ICU",
      "total": 20,
      "occupied": 14,
      "available": 6,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-70-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 5,
      "available": 5,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-70-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 19,
      "available": 131,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-70-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-71": [
    {
      "id": "cap-hosp-71-1",
      "name": "ICU",
      "total": 20,
      "occupied": 8,
      "available": 12,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-71-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 0,
      "available": 10,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-71-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 37,
      "available": 113,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-71-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-72": [
    {
      "id": "cap-hosp-72-1",
      "name": "ICU",
      "total": 20,
      "occupied": 10,
      "available": 10,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-72-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 7,
      "available": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-72-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 15,
      "available": 135,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-72-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-73": [
    {
      "id": "cap-hosp-73-1",
      "name": "ICU",
      "total": 20,
      "occupied": 1,
      "available": 19,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-73-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 7,
      "available": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-73-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 45,
      "available": 105,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-73-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "LIMITED"
    }
  ],
  "hosp-74": [
    {
      "id": "cap-hosp-74-1",
      "name": "ICU",
      "total": 20,
      "occupied": 3,
      "available": 17,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-74-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 1,
      "available": 9,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-74-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 60,
      "available": 90,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-74-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-75": [
    {
      "id": "cap-hosp-75-1",
      "name": "ICU",
      "total": 20,
      "occupied": 8,
      "available": 12,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-75-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 3,
      "available": 7,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-75-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 65,
      "available": 85,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-75-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-76": [
    {
      "id": "cap-hosp-76-1",
      "name": "ICU",
      "total": 20,
      "occupied": 13,
      "available": 7,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-76-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 1,
      "available": 9,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-76-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 108,
      "available": 42,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-76-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-77": [
    {
      "id": "cap-hosp-77-1",
      "name": "ICU",
      "total": 20,
      "occupied": 0,
      "available": 20,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-77-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 9,
      "available": 1,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-77-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 48,
      "available": 102,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-77-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-78": [
    {
      "id": "cap-hosp-78-1",
      "name": "ICU",
      "total": 20,
      "occupied": 19,
      "available": 1,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-78-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 9,
      "available": 1,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-78-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 81,
      "available": 69,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-78-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-79": [
    {
      "id": "cap-hosp-79-1",
      "name": "ICU",
      "total": 20,
      "occupied": 7,
      "available": 13,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-79-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 7,
      "available": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-79-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 3,
      "available": 147,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-79-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "AVAILABLE"
    }
  ],
  "hosp-80": [
    {
      "id": "cap-hosp-80-1",
      "name": "ICU",
      "total": 20,
      "occupied": 17,
      "available": 3,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-80-2",
      "name": "Ventilator",
      "total": 10,
      "occupied": 6,
      "available": 4,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-80-3",
      "name": "General Beds",
      "total": 150,
      "occupied": 0,
      "available": 150,
      "status": "AVAILABLE"
    },
    {
      "id": "cap-hosp-80-4",
      "name": "Emergency",
      "total": 0,
      "occupied": 0,
      "available": 0,
      "status": "LIMITED"
    }
  ]
};