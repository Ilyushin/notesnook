import React from 'react';
import { FlatList, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { notesnook } from '../../../e2e/test.ids';
import { useTracked } from '../../provider';
import { Actions } from '../../provider/Actions';
import {
  ACCENT,
  COLOR_SCHEME,
  COLOR_SCHEME_DARK,
  COLOR_SCHEME_LIGHT,
  setColorScheme
} from '../../utils/Colors';
import { MenuItemsList } from '../../utils/index';
import { MMKV } from '../../utils/mmkv';
import Seperator from '../Seperator';
import { ColorSection } from './ColorSection';
import { MenuListItem } from './MenuListItem';
import { TagsSection } from './TagsSection';
import { UserSection } from './UserSection';

export const Menu = React.memo(
  () => {
    const [state, dispatch] = useTracked();
    const {colors,deviceMode} = state;
    const insets = useSafeAreaInsets();
    const noTextMode = false;
    function changeColorScheme(colors = COLOR_SCHEME, accent = ACCENT) {
      let newColors = setColorScheme(colors, accent);
      dispatch({type: Actions.THEME, colors: newColors});
    }

    const BottomItemsList = [
      {
        name: 'Night mode',
        icon: 'theme-light-dark',
        func: () => {
          if (!colors.night) {
            MMKV.setStringAsync('theme', JSON.stringify({night: true}));
            changeColorScheme(COLOR_SCHEME_DARK);
          } else {
            MMKV.setStringAsync('theme', JSON.stringify({night: false}));
            changeColorScheme(COLOR_SCHEME_LIGHT);
          }
        },
        switch: true,
        on: !!colors.night,
        close: false,
      },
      {
        name: 'Settings',
        icon: 'cog-outline',
        close: true,
      },
    ];

    return (
      <View
        style={{
          height: '100%',
          width: '100%',
          backgroundColor:deviceMode !== "mobile"? colors.nav : colors.bg,
          paddingTop: insets.top,
        }}>
        <FlatList
          alwaysBounceVertical={false}
          contentContainerStyle={{
            flexGrow: 1,
          }}
          style={{
            height: '100%',
            width: '100%',
          }}
          showsVerticalScrollIndicator={false}
          data={[0]}
          keyExtractor={() => 'mainMenuView'}
          renderItem={() => (
            <>
              {MenuItemsList.map((item, index) => (
                <MenuListItem key={item.name} item={item} testID={item.name} index={index} />
              ))}
              <ColorSection noTextMode={noTextMode} />
              <TagsSection />
            </>
          )}
        />

        {BottomItemsList.map((item, index) => (
          <MenuListItem
            testID={
              item.name == 'Night mode'
                ? notesnook.ids.menu.nightmode
                : item.name
            }
            key={item.name}
            item={item}
            index={index}
            ignore={true}
            noTextMode={false}
          />
        ))}
        <View
          style={{
            width: '100%',
            paddingHorizontal: 8,
          }}>
          <UserSection noTextMode={noTextMode} />
          <Seperator />
        </View>
      </View>
    );
  },
  () => true,
);
