// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'watchlist.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$Watchlist extends Watchlist {
  @override
  final BuiltList<WatchlistItem> items;

  factory _$Watchlist([void Function(WatchlistBuilder)? updates]) =>
      (WatchlistBuilder()..update(updates))._build();

  _$Watchlist._({required this.items}) : super._();
  @override
  Watchlist rebuild(void Function(WatchlistBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  WatchlistBuilder toBuilder() => WatchlistBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is Watchlist && items == other.items;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, items.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'Watchlist')..add('items', items))
        .toString();
  }
}

class WatchlistBuilder implements Builder<Watchlist, WatchlistBuilder> {
  _$Watchlist? _$v;

  ListBuilder<WatchlistItem>? _items;
  ListBuilder<WatchlistItem> get items =>
      _$this._items ??= ListBuilder<WatchlistItem>();
  set items(ListBuilder<WatchlistItem>? items) => _$this._items = items;

  WatchlistBuilder() {
    Watchlist._defaults(this);
  }

  WatchlistBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _items = $v.items.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(Watchlist other) {
    _$v = other as _$Watchlist;
  }

  @override
  void update(void Function(WatchlistBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  Watchlist build() => _build();

  _$Watchlist _build() {
    _$Watchlist _$result;
    try {
      _$result = _$v ??
          _$Watchlist._(
            items: items.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'items';
        items.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'Watchlist', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
