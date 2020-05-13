# -*- coding: utf-8 -*-
import pytest

import os
import sys
sys.path.append(os.getcwd())


import clue
from clue.cluelogic import Player


class TestPlayer:
    def test_init(self):
        pl = Player(u"Sven", u"Miss Scarlett")
        assert(pl._player_name == u"Sven")
        assert(pl._character_name == u"Miss Scarlett")
    
    def test_wrong_character(self):
        with pytest.raises(ValueError):
            pl = Player(u"Sven", u"Mis Scarlett")
    
    def test_get_names(self):
        pl = Player(u"Sven", u"Miss Scarlett")
        assert(pl.get_playername() == u"Sven")
        assert(pl.get_charactername() == u"Miss Scarlett")
    
        