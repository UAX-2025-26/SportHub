const mockFrom = jest.fn();
const mockSelect = jest.fn(() => ({ eq: mockEq, neq: mockNeq, in: mockIn, order: mockOrder }));
const mockInsert = jest.fn();
const mockUpdate = jest.fn();
const mockEq = jest.fn(() => ({ select: mockSelect, single: mockSingle, update: mockUpdate, eq: mockEq, order: mockOrder }));
const mockNeq = jest.fn(() => ({ select: mockSelect, eq: mockEq }));
const mockIn = jest.fn(() => ({ select: mockSelect, order: mockOrder }));
const mockOrder = jest.fn(() => ({ data: [], error: null }));
const mockSingle = jest.fn(() => ({ data: null, error: null }));

const supabase = {
  from: (table) => {
    const q = {
      select: (sel) => ({ eq: mockEq, neq: mockNeq, in: mockIn, order: mockOrder, single: mockSingle }),
      insert: (payload) => ({ select: () => ({ single: () => ({ data: { id: 'new-id', ...payload }, error: null }) }) }),
      update: (payload) => ({ eq: mockEq, select: () => ({ single: () => ({ data: { id: 'updated-id', ...payload }, error: null }) }) })
    };
    return q;
  },
  auth: {
    getUser: async () => ({ data: { user: { id: 'user-uuid', email: 'u@example.com' } }, error: null })
  }
};

module.exports = { supabase };
