// ROI Calculator Helper Types

export interface IndustryBenchmark {
  name: string;
  avgDefectRate: number;
  avgInspectionHours: number;
  avgQualityInspectorSalary: number;
  avgSupervisorSalary: number;
}

export interface CalculatorStep {
  id: number;
  title: string;
  description: string;
}

export const INDUSTRY_BENCHMARKS: IndustryBenchmark[] = [
  {
    name: "Manufacturing",
    avgDefectRate: 3.5,
    avgInspectionHours: 6,
    avgQualityInspectorSalary: 45000,
    avgSupervisorSalary: 65000,
  },
  {
    name: "Ceramics",
    avgDefectRate: 4.2,
    avgInspectionHours: 8,
    avgQualityInspectorSalary: 42000,
    avgSupervisorSalary: 60000,
  },
  {
    name: "Textiles",
    avgDefectRate: 5.0,
    avgInspectionHours: 7,
    avgQualityInspectorSalary: 38000,
    avgSupervisorSalary: 55000,
  },
];
