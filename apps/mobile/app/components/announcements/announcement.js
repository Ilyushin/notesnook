/*
This file is part of the Notesnook project (https://notesnook.com/)

Copyright (C) 2022 Streetwriters (Private) Limited

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import React from "react";
import { FlatList, View } from "react-native";
import { useSelectionStore } from "../../stores/use-selection-store";
import { useMessageStore } from "../../stores/use-message-store";
import { useThemeStore } from "../../stores/use-theme-store";
import { allowedOnPlatform, renderItem } from "./functions";

export const Announcement = ({ color }) => {
  const colors = useThemeStore((state) => state.colors);
  const announcements = useMessageStore((state) => state.announcements);
  let announcement = announcements.length > 0 ? announcements[0] : null;
  const selectionMode = useSelectionStore((state) => state.selectionMode);
  return !announcement || selectionMode ? null : (
    <View
      style={{
        backgroundColor: colors.bg,
        width: "100%",
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: 12
      }}
    >
      <View
        style={{
          width: "100%",
          borderRadius: 10,
          overflow: "hidden",
          backgroundColor: colors.nav,
          paddingBottom: 12
        }}
      >
        <View>
          <FlatList
            style={{
              width: "100%",
              marginTop: 12
            }}
            data={announcement?.body.filter((item) =>
              allowedOnPlatform(item.platforms)
            )}
            renderItem={({ item, index }) =>
              renderItem({
                item: item,
                index: index,
                color: colors[color],
                inline: true
              })
            }
          />
        </View>
      </View>
    </View>
  );
};
