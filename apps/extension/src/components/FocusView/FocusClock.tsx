import { usePomodoro } from '@/hooks/usePomodoro'
import { Clock } from '../common/Clock'
import { PomodoroControls } from './PomodoroControls'

export function FocusClock() {
  const pomodoro = usePomodoro()

  return (
    <>
      <Clock
        variant="large"
        showGreeting
        pomodoroMode={pomodoro.mode}
        pomodoroTimeLeft={pomodoro.timeLeft}
      />
      <PomodoroControls
        mode={pomodoro.mode}
        isRunning={pomodoro.isRunning}
        completedCount={pomodoro.completedCount}
        onStart={pomodoro.start}
        onPause={pomodoro.pause}
        onResume={pomodoro.resume}
        onReset={pomodoro.reset}
        onSkip={pomodoro.skip}
      />
    </>
  )
}
