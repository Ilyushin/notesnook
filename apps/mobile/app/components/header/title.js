import { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import Notebook from "../../screens/notebook";
import {
  eSubscribeEvent,
  eUnSubscribeEvent
} from "../../services/event-manager";
import useNavigationStore from "../../stores/use-navigation-store";
import { useThemeStore } from "../../stores/use-theme-store";
import { db } from "../../common/database";
import { eScrollEvent } from "../../utils/events";
import { SIZE } from "../../utils/size";
import Heading from "../ui/typography/heading";
import Paragraph from "../ui/typography/paragraph";

const titleState = {};

export const Title = () => {
  const colors = useThemeStore((state) => state.colors);
  const currentScreen = useNavigationStore((state) => state.currentScreen);
  const isNotebook = currentScreen.name === "Notebook";
  const isTopic = currentScreen?.name === "TopicNotes";
  const [hide, setHide] = useState(
    isNotebook
      ? typeof titleState[currentScreen.id] === "boolean"
        ? titleState[currentScreen.id]
        : true
      : false
  );
  const isHidden = titleState[currentScreen.id];
  console.log(currentScreen, "header");
  const notebook =
    isTopic && currentScreen.notebookId
      ? db.notebooks?.notebook(currentScreen.notebookId)?.data
      : null;
  const title = currentScreen.title;
  const isTag = currentScreen?.name === "TaggedNotes";

  const onScroll = (data) => {
    if (currentScreen.name !== "Notebook") {
      setHide(false);
      return;
    }
    if (data.y > 150) {
      if (!hide) return;
      setHide(false);
    } else {
      if (hide) return;
      setHide(true);
    }
  };

  useEffect(() => {
    if (currentScreen.name === "Notebook") {
      let value =
        typeof titleState[currentScreen.id] === "boolean"
          ? titleState[currentScreen.id]
          : true;
      setHide(value);
    } else {
      setHide(titleState[currentScreen.id]);
    }
  }, [currentScreen.id]);

  useEffect(() => {
    titleState[currentScreen.id] = hide;
  }, [hide]);

  useEffect(() => {
    eSubscribeEvent(eScrollEvent, onScroll);
    return () => {
      eUnSubscribeEvent(eScrollEvent, onScroll);
    };
  }, [hide]);

  function navigateToNotebook() {
    if (!isTopic) return;
    Notebook.navigate(notebook, true);
  }
  return (
    <View
      style={{
        opacity: 1,
        flexShrink: 1,
        flexDirection: "row"
      }}
    >
      {!hide && !isHidden ? (
        <Heading
          onPress={navigateToNotebook}
          numberOfLines={isTopic ? 2 : 1}
          size={isTopic ? SIZE.md + 2 : SIZE.xl}
          style={{
            flexWrap: "wrap",
            marginTop: Platform.OS === "ios" ? -1 : 0
          }}
          color={currentScreen.color || colors.heading}
        >
          {isTopic ? (
            <Paragraph numberOfLines={1} size={SIZE.xs + 1}>
              {notebook?.title}
              {"\n"}
            </Paragraph>
          ) : null}
          {isTag ? (
            <Heading
              size={isTopic ? SIZE.md + 2 : SIZE.xl}
              color={colors.accent}
            >
              #
            </Heading>
          ) : null}
          {title}
        </Heading>
      ) : null}
    </View>
  );
};