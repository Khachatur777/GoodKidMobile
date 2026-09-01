import { createStackNavigator } from '@react-navigation/stack';
import { screenMainOptions } from '../tabs-config';
import { tasksScreens } from './tasks-config';

const TasksStack = createStackNavigator();

export const TasksTab = () => {
  return (
    <TasksStack.Navigator screenOptions={screenMainOptions}>
      {tasksScreens.map(screen => (
        <TasksStack.Screen key={screen.name} {...screen} />
      ))}
    </TasksStack.Navigator>
  );
};
