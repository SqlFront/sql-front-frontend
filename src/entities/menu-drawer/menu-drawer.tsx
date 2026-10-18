import { useAppDispatch } from "@/shared/hooks/redux";
import { logoutUser } from "@/store/reducers/actions/auth-action";
import { Link } from "@/shared/ui/link/link";
import { Drawer, type DrawerProps } from "@/shared/ui/drawer/drawer";
import { MenuItemType, menuCoonfig } from "@/shared/consts/menu-config";
import { QuestIds } from "@/shared/consts/quest-id";

import styles from "./menu-drawer.module.scss";

type MenuDrawerProps = DrawerProps & {
  currentPage: "main" | typeof menuCoonfig.authorized[number]["page"];
  isAuth?: boolean;
};

const resolveHref = (
  href: MenuItemType["href"],
  questId?: QuestIds,
): string => {
  return typeof href === "string" ? href : href({ questId });
};

export const MenuDrawer = ({
  isAuth = true,
  isOpen,
  currentPage,
  onClose,
}: MenuDrawerProps) => {
  const dispatch = useAppDispatch();
  
  const config = menuCoonfig[isAuth? "authorized" : "unauthorized"];

  const preparedMenu = config.map((item) => {
    if (item.page === "quest" && currentPage === "quest") {
      return item;
    }

    return {
      ...item,
      children: undefined
    };
  });

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
    >
      <Link
        href="/"
        size="4vw"
        onClick={onClose}
        underline={currentPage === "main"}
        fontVariant="capital"
        color="red"
      >
        SQL фронт
      </Link>
      <div className={styles.linksBlock}>
        {preparedMenu.map((link) => (
          <>
            <Link
              key={link.page}
              href={resolveHref(link.href)}
              size="1vw"
              onClick={() => {
                if (link.page === "logout") {
                  dispatch(logoutUser());
                }
                onClose();
              }}
              underline={currentPage === link.page}
            >
              {link.text}
            </Link>

            {link.children &&
              <div className={styles.childBlock} style={{ marginLeft: "1.5vw" }}>
                {link.children.map((child) => 
                  <Link
                    key={child.page}
                    href={resolveHref(child.href)}
                  >
                    {child.text}
                  </Link>
                )}
              </div>
            }
          </>
        ))}
        <div style={{ marginTop: "2vw", borderTop: "0.05vw solid #eee", paddingTop: "1vw" }}>
          <a
            href="https://forms.yandex.ru/u/6ad49fb0852af3e621c7a24c/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4vw",
              fontSize: "0.9vw",
              color: "#e53e3e",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            <span>🐛</span> Сообщить о баге
          </a>
        </div>
      </div>
    </Drawer>
  );
};
