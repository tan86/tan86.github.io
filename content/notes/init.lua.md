---
title: "nvimrc"
tags:
- dotfiles 
---
```lua
vim.cmd "packadd paq-nvim"
vim.g.mapleader = ','
local indent = 4
local lsp, cmp = require'lspconfig', require'cmp'
local set = vim.opt

local function map(mode, lhs, rhs, opts)
	local options = {noremap = true, silent = true}
	if opts then options = vim.tbl_extend('force', options, opts) end
	vim.api.nvim_set_keymap(mode, lhs, rhs, options)
end

local has_words_before = function()
	local line, col = unpack(vim.api.nvim_win_get_cursor(0))
	return col ~= 0 and vim.api.nvim_buf_get_lines(0, line - 1, line, true)[1]:sub(col, col):match('%s') == nil
end

local feedkey = function(key, mode)
	vim.api.nvim_feedkeys(vim.api.nvim_replace_termcodes(key, true, true, true), mode, true)
end

set.clipboard = 'unnamedplus'
set.viewoptions = 'folds,cursor'
set.completeopt = 'menu,menuone,noselect'
set.complete = '.,w,b,u,t,k'
set.colorcolumn = '80'
--set.dict = '/usr/share/dict/words'
set.dict = '~/AppData/Local/nvim/words'
set.foldcolumn="auto:4"
set.hidden = true
set.ignorecase = true
set.laststatus=3
set.list = true
set.listchars = {tab='┊ ', eol='¬', trail='-', nbsp='+'}
set.mouse="a"
set.number = true
set.relativenumber = true
set.scrolloff = 4
set.shiftround = true
set.shiftwidth = indent
set.sidescrolloff = 8
--set.signcolumn = 'yes:2'
set.smartcase = true
set.smartindent = true
set.splitbelow = true
set.splitright = true
set.tabstop = indent
set.termguicolors = true
set.wildmode = 'list:longest'
set.wrap = false
vim.cmd('highlight WinSeparator guibg=None')
--require"catppuccin".setup({transparent_background = true})
vim.g.catppuccin_flavour = "mocha" -- latte, frappe, macchiato, mocha
vim.cmd[[colorscheme catppuccin]]

-- Mappings
map('n', '<Space>',   '<NOP>')
map('n', '<Leader>h', ':noh<CR>')
-- for better Movement between Buffers
map('n', '<Tab>',   ':bnext<CR>')
map('n', '<S-Tab>', ':bprev<CR>')
-- Windows
map('n', '<C-Down>', ':res -2<CR>')
map('n', '<C-Up>', ':res +2<CR>')
map('n', '<C-Left>', ':vert res +2<CR>')
map('n', '<C-Right>', ':vert res -2<CR>')
map('n', '<C-q>', '<C-w><C-q>')
-- Terminal
map('n', '<Leader>t', ':vs term://cmd<CR>')
map('n', '<Leader>q', 'Aexit<CR>')
map('t', '<Leader><ESC>', '<C-\\><C-n>')
-- Fold
map('n', '<Leader>F', '$<S-v>%zf<CR>')
map('n', '<C-Left>', 'zc')
map('n', '<C-Right>', 'zo')

-- Compile/Run
map('n', '<Leader>B', ':!g++ -c % .\\imgui\\imgui*.cpp -I.\\imgui <CR>| :!g++ -o %.exe .\\*.o -lSDL2 -lSDL2main -lopengl32<CR>')
map('n', '<Leader>r', ':!%.exe<CR>')

require "paq" {
	'hrsh7th/cmp-buffer';
	'hrsh7th/cmp-cmdline';
	'hrsh7th/cmp-nvim-lsp';
	'hrsh7th/cmp-path';
	'hrsh7th/cmp-vsnip';
	'hrsh7th/nvim-cmp';
	'hrsh7th/vim-vsnip';
	'morhetz/gruvbox';
	'neovim/nvim-lspconfig';
	'savq/paq-nvim';
	'catppuccin/nvim';
}

-- LSP
cmp.setup({
	snippet = {
		expand = function(args)
			vim.fn['vsnip#anonymous'](args.body)
		end,
	},
	mapping = {
		['<Tab>'] = cmp.mapping(function(fallback)
			if cmp.visible() then
				cmp.select_next_item()
			elseif vim.fn['vsnip#available'](1) == 1 then
				feedkey('<Plug>(vsnip-expand-or-jump)', '')
			elseif has_words_before() then
				cmp.mapping.complete()
			else
				fallback()
			end

		end, {'i', 's'}),
		['<S-Tab>'] = cmp.mapping(function()
			if cmp.visible() then
				cmp.select_prev_item()
			elseif vim.fn['vsnip#jumpable'](-1) == 1 then
				feedkey('<Plug>(vsnip-jump-prev)', '')
			end
		end, {'i','s'}),
		['<C-b>'] = cmp.mapping(cmp.mapping.scroll_docs(-4), { 'i', 'c' }),
		['<C-f>'] = cmp.mapping(cmp.mapping.scroll_docs(4), { 'i', 'c' }),
		['<C-e>'] = cmp.mapping({
			i = cmp.mapping.abort(),
			c = cmp.mapping.close(),
		}),
		['<CR>'] = cmp.mapping.confirm({select = true})
	},
	sources = cmp.config.sources({{name='nvim_lsp'},{name='vsnip'},{name='buffer'},{name='path'}})
})
cmp.setup.cmdline('/', {mapping = cmp.mapping.preset.cmdline(), sources = {{name='buffer'}}})
cmp.setup.cmdline(':', {mapping = cmp.mapping.preset.cmdline(),sources = cmp.config.sources({{name='path'}}, {{name='cmdline'}})})

local on_attach = function(client, bufnr)
	local function buf_map(mode, lhs, rhs, opts)
		local options = {noremap = true, silent = true}
		if opts then options = vim.tbl_extend('force', options, opts) end
		vim.api.nvim_buf_set_keymap(bufnr, mode, lhs, rhs, options)
	end
	buf_map('n', 'gD',         ':lua vim.lsp.buf.declaration()<CR>')
	buf_map('n', 'gd',         ':lua vim.lsp.buf.definition()<CR>')
	buf_map('n', 'gi',         ':lua vim.lsp.buf.implementation()<CR>')
	buf_map('n', 'gr',         ':lua vim.lsp.buf.references()<CR>')
	buf_map('n', 'K',          ':lua vim.lsp.buf.hover()<CR>')

	buf_map('n', '[d',         ':lua vim.lsp.diagnostic.goto_prev()<CR>')
	buf_map('n', ']d',         ':lua vim.lsp.diagnostic.goto_next()<CR>')
	buf_map('n', '<Leader>er', ':lua vim.lsp.diagnostic.show_line_diagnostics()<CR>')
	buf_map('n', '<Leader>q',  ':lua vim.lsp.diagnostic.set_loclist()<CR>')
	buf_map('n', '<Leader>k',  ':lua vim.lsp.buf.hover()<CR>')
	buf_map('n', '<C-k>',      ':lua vim.lsp.buf.signature_help()<CR>')
	buf_map('n', '<Leader>rn', ':lua vim.lsp.buf.rename()<CR>')
	buf_map('n', '<Leader>ca', ':lua vim.lsp.buf.code_action()<CR>')
	-- Formatting
	if client.resolved_capabilities.document_formatting then
		buf_map('n', '<Leader>f', ':lua vim.lsp.buf.formatting()<CR>')
	end
	if client.resolved_capabilities.document_range_formatting then
		buf_map('v', '<Leader>f', ':lua vim.lsp.buf.range_formatting()<CR>')
	end
	-- autocmds highlighting
	if client.resolved_capabilities.document_highlight then
		vim.api.nvim_exec([[
		hi LspReferenceRead cterm=bold ctermbg=red guibg=LightYellow
		hi LspReferenceText cterm=bold ctermbg=red guibg=LightYellow
		hi LspReferenceWrite cterm=bold ctermbg=red guibg=LightYellow
		augroup lsp_doc_highlight
		autocmd! * <buffer>
		autocmd CursorHold <buffer> lua vim.lsp.buf.document_highlight()
		autocmd CursorMoved <buffer> lua vim.lsp.buf.clear_references()
		augroup END
		]], false)
	end
end

-- C,C++
lsp.clangd.setup {
	on_attach = on_attach,
	capabilities = require('cmp_nvim_lsp').update_capabilities(vim.lsp.protocol.make_client_capabilities()),
	cmd ={
		'clangd'
		,'--background-index'
		,'--pch-storage=memory'
		,'--suggest-missing-includes'
		,'--clang-tidy'
		,'--all-scopes-completion'
		,'--completion-style=detailed'
		,'--header-insertion=iwyu'
		,'--enable-config'
		--		,'--query-driver'
		,'--resource-dir=C:\\msys64\\mingw64'
	},
}
```