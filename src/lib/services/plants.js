const plantsDb = [
  {
    id: "p1",
    name: "Tulsi (Holy Basil)",
    image: "https://images.unsplash.com/photo-1627885542152-32bba08cb176?q=80&w=400&auto=format&fit=crop",
    type: "Herb",
    difficulty: "Easy",
    idealTemp: [15, 35],
    spaces: ["Balcony", "Terrace", "Backyard", "Indoor"],
    care: "Requires full sun and well-drained soil. Water deeply but infrequently."
  },
  {
    id: "p2",
    name: "Aloe Vera",
    image: "https://images.unsplash.com/photo-1596547609652-9fc5d8d428ce?q=80&w=400&auto=format&fit=crop",
    type: "Succulent",
    difficulty: "Easy",
    idealTemp: [13, 35],
    spaces: ["Indoor", "Balcony"],
    care: "Bright, indirect sunlight. Allow soil to dry completely between waterings."
  },
  {
    id: "p3",
    name: "Mint",
    image: "https://images.unsplash.com/photo-1626074964645-846174dcb899?q=80&w=400&auto=format&fit=crop",
    type: "Herb",
    difficulty: "Easy",
    idealTemp: [12, 25],
    spaces: ["Balcony", "Backyard"],
    care: "Keep soil consistently moist. Can tolerate partial shade."
  },
  {
    id: "p4",
    name: "Chili Plant",
    image: "https://images.unsplash.com/photo-1574246879105-09c3132e6503?q=80&w=400&auto=format&fit=crop",
    type: "Vegetable",
    difficulty: "Medium",
    idealTemp: [20, 35],
    spaces: ["Balcony", "Terrace", "Backyard"],
    care: "Needs 6-8 hours of direct sunlight. Water regularly."
  },
  {
    id: "p5",
    name: "Snake Plant",
    image: "https://images.unsplash.com/photo-1593482892290-f54927ae1236?q=80&w=400&auto=format&fit=crop",
    type: "Indoor/Ornamental",
    difficulty: "Easy",
    idealTemp: [10, 35],
    spaces: ["Indoor", "Balcony"],
    care: "Extremely forgiving. Tolerates low light and rare watering."
  },
  {
    id: "p6",
    name: "Tomato",
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?q=80&w=400&auto=format&fit=crop",
    type: "Vegetable",
    difficulty: "Medium",
    idealTemp: [18, 30],
    spaces: ["Terrace", "Backyard", "Balcony"],
    care: "Requires large pots, regular watering, and full sun."
  },
  {
    id: "p7",
    name: "Rosemary",
    image: "https://images.unsplash.com/photo-1594537021111-e6df5ddf3bc4?q=80&w=400&auto=format&fit=crop",
    type: "Herb",
    difficulty: "Medium",
    idealTemp: [15, 30],
    spaces: ["Balcony", "Terrace"],
    care: "Needs sandy, well-draining soil and plenty of sun. Do not overwater."
  },
  {
    id: "p8",
    name: "Money Plant (Pothos)",
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=400&auto=format&fit=crop",
    type: "Indoor Vine",
    difficulty: "Easy",
    idealTemp: [15, 30],
    spaces: ["Indoor", "Balcony"],
    care: "Thrives in indirect light. Let the top soil dry before watering."
  }
];

export function recommendPlants({ temp, space, size }) {
  // AI/Rule-based filtering logic
  
  let suitable = plantsDb.filter(plant => {
    // 1. Check climate (temperature falls loosely within ideal range)
    const tempOk = temp >= plant.idealTemp[0] - 5 && temp <= plant.idealTemp[1] + 5;
    
    // 2. Check space
    const spaceOk = plant.spaces.includes(space);

    return tempOk && spaceOk;
  });

  // 3. Space size constraints (e.g. Small space limits large vegetables like Tomatoes)
  if (size === "Small") {
     suitable = suitable.filter(plant => (plant.name !== "Tomato" && plant.name !== "Large Shrubs"));
  }

  // If too few results, fallback to easiest plants
  if (suitable.length === 0) {
    suitable = plantsDb.filter(p => p.difficulty === "Easy").slice(0, 3);
  }

  return suitable;
}
