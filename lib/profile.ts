import type { TopicKey } from "./types";

export const profile = {
  fieldDescription:
    "Spiking neural networks, test-time adaptation, NeuroSimDNN, reinforcement learning, DVFS, energy-efficient inference, and network early exit.",
  topics: {
    snn: {
      label: "SNN / Neuromorphic",
      quota: 2,
      keywords: [
        "spiking neural network",
        "spiking neural networks",
        "surrogate gradient",
        "neuromorphic",
        "event-driven neural"
      ]
    },
    tta: {
      label: "Test-Time Adaptation",
      quota: 1,
      keywords: [
        "test-time adaptation",
        "test time adaptation",
        "online adaptation",
        "domain shift",
        "continual adaptation"
      ]
    },
    neurosim: {
      label: "NeuroSim / Hardware-aware DNN",
      quota: 2,
      keywords: [
        "NeuroSim",
        "NeuroSimDNN",
        "hardware-aware",
        "compute-in-memory",
        "neuromorphic accelerator",
        "in-memory computing"
      ]
    },
    rl: {
      label: "Reinforcement Learning",
      quota: 1,
      keywords: [
        "reinforcement learning",
        "deep reinforcement learning",
        "policy optimization",
        "adaptive control"
      ]
    },
    dvfs: {
      label: "DVFS / Energy",
      quota: 2,
      keywords: [
        "DVFS",
        "dynamic voltage frequency scaling",
        "energy-efficient inference",
        "power-aware scheduling",
        "energy optimization"
      ]
    },
    early_exit: {
      label: "Network Early Exit",
      quota: 2,
      keywords: [
        "early exit",
        "dynamic neural network",
        "adaptive inference",
        "conditional computation",
        "anytime prediction"
      ]
    }
  } satisfies Record<TopicKey, { label: string; quota: number; keywords: string[] }>,
  negativeKeywords: [
    "survey",
    "medical imaging",
    "large language model benchmark",
    "pure theory"
  ]
};

export const topicKeys = Object.keys(profile.topics) as TopicKey[];
