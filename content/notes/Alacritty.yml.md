```yaml
import:
  - "~/.alacritty/catppuccin.yml"

env:
  TERM: xterm-256color

window:
  dimensions:
    columns: 100
    lines: 30
  padding:
    x: 0
    y: 0
  dynamic_padding: false
  opacity: 0.85
    # decorations: none
scrolling:
  history: 1000
  multiplier: 3
  faux_multiplier: 3
  auto_scroll: false
tabspaces: 4
font:
  normal:
    family: Fira Code
    style: Regular
  bold:
    family: Fira Code
    style: Bold
  italic:
    family: Fira Code
    style: Italic
  # Point size of the font
  size: 12.0

  # Offset is the extra space around each character. offset.y can be thought of
  # as modifying the linespacing, and offset.x as modifying the letter spacing.
  offset:
    x: 0
    y: 0

  # Glyph offset determines the locations of the glyphs within their cells with
  # the default being at the bottom. Increase the x offset to move the glyph to
  # the right, increase the y offset to move the glyph upward.
  glyph_offset:
    x: 0
    y: 0
  # When true, bold text is drawn using the bright variant of colors.
  draw_bold_text_with_bright_colors: false
  scale_with_dpi: true

  # Use custom cursor colors. If true, display the cursor in the cursor.foreground
  # and cursor.background colors, otherwise invert the colors of the cursor.
  custom_cursor_colors: true

live_config_reload: true

bell:
  animation: EaseOutExpo
  color: '0xffffff'
  duration: 0

debug:
  render_time: false
  log_level: Off
  persistent_logging: false
  print_events: false
  ref_tests: false
  highlight_damage: false

shell:
  program: /bin/zsh
  args:
    - --login
    - -i
key_bindings:
  #  - { key: V, mods: Control, action: Paste }
  - { key: W, mods: Control, action: Quit  }
  - { key: T, mods: Control, action: CreateNewWindow }
    #  - { key: F10, mods: Control, command: { program: "zsh", args: ["./b.sh"]}}
  - { key: F10, chars: "./b.sh\x0d"}
```