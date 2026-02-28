// ROI Calculator Business Logic
// This file contains the core calculation functions for the ROI calculator.

export interface ROIInput {
  industry: string;
  employeeCount: number;
  annualRevenue: number;
  defectRate: number;
  inspectionHoursPerDay: number;
  qualityInspectorSalary: number;
  supervisorSalary: number;
}

export interface ROIResult {
  annualSavings: number;
  implementationCost: number;
  paybackPeriodMonths: number;
  threeYearROI: number;
  defectReduction: number;
  laborSavings: number;
  qualityImprovement: number;
}

export function calculateROI(input: ROIInput): ROIResult {
  // Placeholder calculation logic
  const defectReduction = input.defectRate * 0.6;
  const laborSavings = input.qualityInspectorSalary * input.employeeCount * 0.3;
  const qualityImprovement = input.annualRevenue * (defectReduction / 100) * 0.5;
  const annualSavings = laborSavings + qualityImprovement;
  const implementationCost = input.annualRevenue * 0.02;
  const paybackPeriodMonths = Math.ceil((implementationCost / annualSavings) * 12);
  const threeYearROI = ((annualSavings * 3 - implementationCost) / implementationCost) * 100;

  return {
    annualSavings,
    implementationCost,
    paybackPeriodMonths,
    threeYearROI,
    defectReduction,
    laborSavings,
    qualityImprovement,
  };
}
