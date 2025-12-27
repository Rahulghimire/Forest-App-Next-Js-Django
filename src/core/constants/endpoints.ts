export const endpoints = {
  auth: {
    login: "/user/login/",
    changePassword: "/user/change-password/",
  },

  user: {
    all: "/user/",
    create: "/user/create/",
    permissions: "/user/permission/",
    byId: (id: string | number) => `/user/${id}/`,
    updatePermissions: (id: string | number) => `/user/${id}/`,
  },

  position: {
    all: "/user/position/",
    create: "/user/position/",
    byId: (id: string | number) => `/user/position/${id}/`,
    update: (id: string | number) => `/user/position/${id}/`,
    delete: (id: string | number) => `/user/position/${id}/`,
  },

  transaction: {
    incomes: {
      all: "/transaction/incomes/",
      create: "/transaction/incomes/",
      byId: (id: string | number) => `/transaction/incomes/${id}/`,
      update: (id: string | number) => `/transaction/incomes/${id}/`,
      delete: (id: string | number) => `/transaction/incomes/${id}/`,
    },

    billTitles: {
      all: "/transaction/bill-titles/",
      create: "/transaction/bill-titles/",
      byId: (id: string | number) => `/transaction/bill-titles/${id}/`,
      update: (id: string | number) => `/transaction/bill-titles/${id}/`,
      delete: (id: string | number) => `/transaction/bill-titles/${id}/`,
    },

    budgets: {
      all: "/transaction/budgets/",
      create: "/transaction/budgets/",
      byId: (id: string | number) => `/transaction/budgets/${id}/`,
      update: (id: string | number) => `/transaction/budgets/${id}/`,
      delete: (id: string | number) => `/transaction/budgets/${id}/`,
    },

    expenseTitles: {
      all: "/transaction/expense-titles/",
      create: "/transaction/expense-titles/",
      byId: (id: string | number) => `/transaction/expense-titles/${id}/`,
      update: (id: string | number) => `/transaction/expense-titles/${id}/`,
      delete: (id: string | number) => `/transaction/expense-titles/${id}/`,
    },

    expenseSubtitles: {
      all: "/transaction/expense-subtitles/",
      create: "/transaction/expense-subtitles/",
      byId: (id: string | number) => `/transaction/expense-subtitles/${id}/`,
      update: (id: string | number) => `/transaction/expense-subtitles/${id}/`,
      delete: (id: string | number) => `/transaction/expense-subtitles/${id}/`,
    },
  },

  forest: {
    plots: {
      all: "/forest/plots/",
      create: "/forest/plots/",
      byId: (id: string) => `/forest/plots/${id}/`,
      update: (id: string | number) => `/forest/plots/${id}/`,
      delete: (id: string | number) => `/forest/plots/${id}/`,
    },

    species: {
      all: "/forest/species/",
      create: "/forest/species/",
      byId: (id: string) => `/forest/species/${id}/`,
      update: (id: string) => `/forest/species/${id}/`,
      delete: (id: string) => `/forest/species/${id}/`,
    },

    stocks: {
      all: "/forest/stocks/",
      create: "/forest/stocks/",
      byId: (id: string) => `/forest/stocks/${id}/`,
      update: (id: string) => `/forest/stocks/${id}/`,
      delete: (id: string | number) => `/forest/stocks/${id}/`,
    },

    classifications: {
      all: "/forest/classifications/",
      create: "/forest/classifications/",
      byId: (id: string) => `/forest/classifications/${id}/`,
      update: (id: string) => `/forest/classifications/${id}/`,
      delete: (id: string) => `/forest/classifications/${id}/`,
    },

    classSetups: {
      all: "/forest/class-setups/",
      create: "/forest/class-setups/",
      byId: (id: string) => `/forest/class-setups/${id}/`,
      update: (id: string | number) => `/forest/class-setups/${id}/`,
      delete: (id: string | number) => `/forest/class-setups/${id}/`,
    },

    gradeRules: {
      all: "/forest/grade-rules/",
      create: "/forest/grade-rules/",
      byId: (id: string) => `/forest/grade-rules/${id}/`,
      update: (id: string | number) => `/forest/grade-rules/${id}/`,
      delete: (id: string | number) => `/forest/grade-rules/${id}/`,
    },

    units: {
      all: "/forest/units/",
      create: "/forest/units/",
      byId: (id: string) => `/forest/units/${id}/`,
      update: (id: string | number) => `/forest/units/${id}/`,
      delete: (id: string | number) => `/forest/units/${id}/`,
    },

    depots: {
      all: "/forest/depot/",
      create: "/forest/depot/",
      byId: (id: string) => `/forest/depot/${id}/`,
      update: (id: string | number) => `/forest/depot/${id}/`,
      delete: (id: string | number) => `/forest/depot/${id}/`,
    },
  },

  pilling: {
    intakes: {
      all: "/pilling/intakes/",
      create: "/pilling/intakes/",
      byId: (id: string) => `/pilling/intakes/${id}/`,
      update: (id: string) => `/pilling/intakes/${id}/`,
      delete: (id: string) => `/pilling/intakes/${id}/`,
    },

    classificationUpdates: {
      all: "/pilling/classification-updates/",
      create: "/pilling/classification-updates/",
      byId: (id: string) => `/pilling/classification-updates/${id}/`,
      update: (id: string) => `/pilling/classification-updates/${id}/`,
      delete: (id: string) => `/pilling/classification-updates/${id}/`,
    },

    accounts: {
      all: "/pilling/pilling-accounts/",
      create: "/pilling/pilling-accounts/",
      byId: (id: string) => `/pilling/pilling-accounts/${id}/`,
      update: (id: string) => `/pilling/pilling-accounts/${id}/`,
      delete: (id: string) => `/pilling/pilling-accounts/${id}/`,
    },

    internalTransfers: {
      all: "/pilling/internal-transfers/",
      create: "/pilling/internal-transfers/",
      byId: (id: string) => `/pilling/internal-transfers/${id}/`,
      update: (id: string) => `/pilling/internal-transfers/${id}/`,
      delete: (id: string) => `/pilling/internal-transfers/${id}/`,
    },

    adjustments: {
      all: "/pilling/adjustments/",
      create: "/pilling/adjustments/",
      byId: (id: string) => `/pilling/adjustments/${id}/`,
      update: (id: string) => `/pilling/adjustments/${id}/`,
      delete: (id: string) => `/pilling/adjustments/${id}/`,
    },

    depotTransfers: {
      all: "/pilling/depot-transfers/",
      create: "/pilling/depot-transfers/",
      byId: (id: string) => `/pilling/depot-transfers/${id}/`,
      update: (id: string) => `/pilling/depot-transfers/${id}/`,
      delete: (id: string) => `/pilling/depot-transfers/${id}/`,
    },

    auditLogs: {
      all: "/pilling/audit-logs/",
      create: "/pilling/audit-logs/",
      byId: (id: string) => `/pilling/audit-logs/${id}/`,
      update: "/pilling/audit-logs/",
      delete: "/pilling/audit-logs/",
    },
  },

  billing: {
    tickets: {
      all: "/billing/ticket/",
      create: "/billing/ticket/",
      byId: (id: string) => `/billing/ticket/${id}/`,
      update: (id: string) => `/billing/ticket/${id}/`,
      delete: (id: string) => `/billing/ticket/${id}/`,
    },

    bills: {
      all: "/billing/bills/",
      create: "/billing/bills/",
      byId: (id: string) => `/billing/bills/${id}/`,
      update: (id: string | number) => `/billing/bills/${id}/`,
      delete: (id: string | number) => `/billing/bills/${id}/`,
    },
  },

  payroll: {
    salaries: {
      all: "/payroll/salaries/",
      create: "/payroll/salaries/",
      byId: (id: string) => `/payroll/salaries/${id}/`,
      update: "/payroll/salaries/",
      delete: (id: string | number) => `/payroll/salaries/${id}/`,
    },

    allowances: {
      all: "/payroll/allowances/",
      create: "/payroll/allowances/",
      byId: (id: string | number) => `/payroll/allowances/${id}/`,
      update: (id: string | number) => `/payroll/allowances/${id}/`,
      delete: "/payroll/allowances/",
    },

    deductions: {
      all: "/payroll/deductions/",
      create: "/payroll/deductions/",
      byId: (id: string | number) => `/payroll/deductions/${id}/`,
      update: "/payroll/deductions/",
      delete: "/payroll/deductions/",
    },
  },

  roles: {
    all: "/roles/",
    create: "/roles/",
    byId: (id: string | number) => `/roles/${id}/`,
    update: (id: string | number) => `/roles/${id}/`,
    delete: (id: string | number) => `/roles/${id}/`,
  },

  finance: {
    all: "/finance/",
    create: "/finance/",
    byId: (id: string | number) => `/finance/${id}/`,
    update: (id: string | number) => `/finance/${id}/`,
    delete: (id: string | number) => `/finance/${id}/`,
  },

  members: {
    all: "/member/members/",
    create: "/member/members/",
    byId: (id: string | number) => `/member/members/${id}/`,
    update: (id: string | number) => `/member/${id}/`,
    delete: (id: string | number) => `/member/${id}/`,
  },

  compensation: {
    allowances: {
      all: "/compensation/allowance/",
      create: "/compensation/allowance/",
      byId: (id: string) => `/compensation/allowance/${id}/`,
      update: (id: string) => `/compensation/allowance/${id}/`,
      delete: (id: string) => `/compensation/allowance/${id}/`,
    },

    deductions: {
      all: "/compensation/deduction/",
      create: "/compensation/deduction/",
      byId: (id: string) => `/compensation/deduction/${id}/`,
      update: (id: string) => `/compensation/deduction/${id}/`,
      delete: (id: string) => `/compensation/deduction/${id}/`,
    },

    employeeAllowances: {
      all: "/compensation/empoallowance/",
    },

    employeeDeductions: {
      all: "/compensation/empodeduction/",
    },
  },
} as const;
