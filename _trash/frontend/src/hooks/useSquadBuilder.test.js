import { renderHook, act } from '@testing-library/react';
import { useSquadBuilder } from './useSquadBuilder';

describe('useSquadBuilder hook state machine', () => {
  const p1 = { id: 'p1', name: 'Haaland' };
  const p2 = { id: 'p2', name: 'Mbappe' };
  const p3 = { id: 'p3', name: 'De Bruyne' };
  const mockLocker = [p1, p2, p3];

  test('Scenario 1: Locker -> Empty Pitch Slot', () => {
    const { result } = renderHook(() => useSquadBuilder(mockLocker));
    
    act(() => {
      result.current.handleDragEnd({
        active: { id: 'p1', data: { current: { type: 'LOCKER' } } },
        over: { id: 'pitch-slot-5' }
      });
    });

    expect(result.current.squad[5]).toEqual(p1);
    expect(result.current.lockerRoom).not.toContain(p1);
  });

  test('Scenario 2: Locker -> Occupied Pitch Slot (Swap)', () => {
    const { result } = renderHook(() => useSquadBuilder(mockLocker));
    
    // Setup: put p1 on pitch slot 5
    act(() => {
      result.current.handleDragEnd({ active: { id: 'p1' }, over: { id: 'pitch-slot-5' } });
    });

    // Action: drag p2 from locker to pitch slot 5
    act(() => {
      result.current.handleDragEnd({ active: { id: 'p2' }, over: { id: 'pitch-slot-5' } });
    });

    expect(result.current.squad[5]).toEqual(p2);
    expect(result.current.lockerRoom).toContain(p1);
    expect(result.current.lockerRoom).not.toContain(p2);
  });

  test('Scenario 3: Pitch Slot -> Empty Pitch Slot', () => {
    const { result } = renderHook(() => useSquadBuilder(mockLocker));
    
    // Setup
    act(() => {
      result.current.handleDragEnd({ active: { id: 'p1' }, over: { id: 'pitch-slot-5' } });
    });

    // Action: move p1 to slot 10
    act(() => {
      result.current.handleDragEnd({ active: { id: 'p1' }, over: { id: 'pitch-slot-10' } });
    });

    expect(result.current.squad[5]).toBeNull();
    expect(result.current.squad[10]).toEqual(p1);
  });

  test('Scenario 4: Pitch Slot -> Occupied Pitch Slot (Swap on pitch)', () => {
    const { result } = renderHook(() => useSquadBuilder(mockLocker));
    
    // Setup
    act(() => {
      result.current.handleDragEnd({ active: { id: 'p1' }, over: { id: 'pitch-slot-5' } });
      result.current.handleDragEnd({ active: { id: 'p2' }, over: { id: 'pitch-slot-10' } });
    });

    // Action: drag p1 onto p2's slot
    act(() => {
      result.current.handleDragEnd({ active: { id: 'p1' }, over: { id: 'pitch-slot-10' } });
    });

    expect(result.current.squad[10]).toEqual(p1);
    expect(result.current.squad[5]).toEqual(p2); // p2 should be swapped to p1's old slot
  });

  test('Scenario 5: Pitch Slot -> Locker Room (Bench)', () => {
    const { result } = renderHook(() => useSquadBuilder(mockLocker));
    
    // Setup
    act(() => {
      result.current.handleDragEnd({ active: { id: 'p1' }, over: { id: 'pitch-slot-5' } });
    });

    // Action: drag p1 to locker
    act(() => {
      result.current.handleDragEnd({ active: { id: 'p1' }, over: { id: 'locker-room' } });
    });

    expect(result.current.squad[5]).toBeNull();
    expect(result.current.lockerRoom).toContain(p1);
  });

  test('Scenario 6: Invalid Drop (Void)', () => {
    const { result } = renderHook(() => useSquadBuilder(mockLocker));
    
    // Action: Drop in void (over is null)
    act(() => {
      result.current.handleDragEnd({ active: { id: 'p1' }, over: null });
    });

    // State shouldn't change
    expect(result.current.lockerRoom).toContain(p1);
    expect(result.current.squad.every(slot => slot === null)).toBe(true);
  });
});
