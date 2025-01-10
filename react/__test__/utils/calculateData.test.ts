import { getDateString, firstDay, yesterday, today, filterEmptyObj, filterSellerValues } from '../../utils/calculateDate';

describe('Utility Functions', () => {
  describe('getDateString', () => {
    it('returns the correct date string format', () => {
      const date = new Date(2025, 0, 9);
      expect(getDateString(date)).toBe('2025-01-09');
    });

    it('adds leading zeros to month and day if needed', () => {
      const date = new Date(2025, 4, 5);
      expect(getDateString(date)).toBe('2025-05-05');
    });
  });

  describe('Date constants', () => {
    it('firstDay is the first day of the current month', () => {
      const expected = new Date(today.getFullYear(), today.getMonth(), 1);
      expect(firstDay).toEqual(expected);
    });

    it('yesterday is one day before today', () => {
      const expected = new Date(today);
      expected.setDate(today.getDate() - 1);
      expect(yesterday.toDateString()).toBe(expected.toDateString());
    });
  });

  describe('filterEmptyObj', () => {
    it('removes keys with empty string values', () => {
      const input = { a: 'value', b: '', c: 'another value', d: '' };
      const expected = { a: 'value', c: 'another value' };
      expect(filterEmptyObj(input)).toEqual(expected);
    });

    it('returns the same object if no empty string values exist', () => {
      const input = { a: 'value', b: 'another value' };
      expect(filterEmptyObj(input)).toEqual(input);
    });
  });

  describe('filterSellerValues', () => {
    it('processes seller data correctly when status is true', () => {
      const data: SellerSelect[] = [
        { label: 'Seller 1', value: { id: '1' } },
        { label: 'Seller 2', value: { id: '2' } },
      ];

      const result = filterSellerValues(data, true);
      expect(result).toEqual({
        stringId: 'Seller 1,Seller 2,',
        sellerFilter: 'Seller 1,Seller 2,',
        countTotalItems: 2,
        sellerId: '1,2,',
      });
    });

    it('processes seller data correctly when status is false', () => {
      const data: SellerSelect[] = [
        { label: 'Seller 1', value: { id: '1' } },
        { label: 'Seller 2', value: { id: '2' } },
      ];

      const result = filterSellerValues(data, false);
      expect(result).toEqual({
        stringId: '1,2,',
        sellerFilter: 'Seller 1,Seller 2,',
        countTotalItems: 2,
        sellerId: '1,2,',
      });
    });
  });
});
