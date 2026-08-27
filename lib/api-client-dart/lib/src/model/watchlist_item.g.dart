// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'watchlist_item.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$WatchlistItem extends WatchlistItem {
  @override
  final String instrument;
  @override
  final DateTime addedAt;
  @override
  final int? mostRecentAnalysisId;
  @override
  final DateTime? mostRecentAnalysisAt;

  factory _$WatchlistItem([void Function(WatchlistItemBuilder)? updates]) =>
      (WatchlistItemBuilder()..update(updates))._build();

  _$WatchlistItem._(
      {required this.instrument,
      required this.addedAt,
      this.mostRecentAnalysisId,
      this.mostRecentAnalysisAt})
      : super._();
  @override
  WatchlistItem rebuild(void Function(WatchlistItemBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  WatchlistItemBuilder toBuilder() => WatchlistItemBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is WatchlistItem &&
        instrument == other.instrument &&
        addedAt == other.addedAt &&
        mostRecentAnalysisId == other.mostRecentAnalysisId &&
        mostRecentAnalysisAt == other.mostRecentAnalysisAt;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, instrument.hashCode);
    _$hash = $jc(_$hash, addedAt.hashCode);
    _$hash = $jc(_$hash, mostRecentAnalysisId.hashCode);
    _$hash = $jc(_$hash, mostRecentAnalysisAt.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'WatchlistItem')
          ..add('instrument', instrument)
          ..add('addedAt', addedAt)
          ..add('mostRecentAnalysisId', mostRecentAnalysisId)
          ..add('mostRecentAnalysisAt', mostRecentAnalysisAt))
        .toString();
  }
}

class WatchlistItemBuilder
    implements Builder<WatchlistItem, WatchlistItemBuilder> {
  _$WatchlistItem? _$v;

  String? _instrument;
  String? get instrument => _$this._instrument;
  set instrument(String? instrument) => _$this._instrument = instrument;

  DateTime? _addedAt;
  DateTime? get addedAt => _$this._addedAt;
  set addedAt(DateTime? addedAt) => _$this._addedAt = addedAt;

  int? _mostRecentAnalysisId;
  int? get mostRecentAnalysisId => _$this._mostRecentAnalysisId;
  set mostRecentAnalysisId(int? mostRecentAnalysisId) =>
      _$this._mostRecentAnalysisId = mostRecentAnalysisId;

  DateTime? _mostRecentAnalysisAt;
  DateTime? get mostRecentAnalysisAt => _$this._mostRecentAnalysisAt;
  set mostRecentAnalysisAt(DateTime? mostRecentAnalysisAt) =>
      _$this._mostRecentAnalysisAt = mostRecentAnalysisAt;

  WatchlistItemBuilder() {
    WatchlistItem._defaults(this);
  }

  WatchlistItemBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _instrument = $v.instrument;
      _addedAt = $v.addedAt;
      _mostRecentAnalysisId = $v.mostRecentAnalysisId;
      _mostRecentAnalysisAt = $v.mostRecentAnalysisAt;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(WatchlistItem other) {
    _$v = other as _$WatchlistItem;
  }

  @override
  void update(void Function(WatchlistItemBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  WatchlistItem build() => _build();

  _$WatchlistItem _build() {
    final _$result = _$v ??
        _$WatchlistItem._(
          instrument: BuiltValueNullFieldError.checkNotNull(
              instrument, r'WatchlistItem', 'instrument'),
          addedAt: BuiltValueNullFieldError.checkNotNull(
              addedAt, r'WatchlistItem', 'addedAt'),
          mostRecentAnalysisId: mostRecentAnalysisId,
          mostRecentAnalysisAt: mostRecentAnalysisAt,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
