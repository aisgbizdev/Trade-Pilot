// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'recent_instruments_instruments_inner.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$RecentInstrumentsInstrumentsInner
    extends RecentInstrumentsInstrumentsInner {
  @override
  final String instrument;
  @override
  final DateTime lastAnalyzedAt;
  @override
  final String mode;

  factory _$RecentInstrumentsInstrumentsInner(
          [void Function(RecentInstrumentsInstrumentsInnerBuilder)? updates]) =>
      (RecentInstrumentsInstrumentsInnerBuilder()..update(updates))._build();

  _$RecentInstrumentsInstrumentsInner._(
      {required this.instrument,
      required this.lastAnalyzedAt,
      required this.mode})
      : super._();
  @override
  RecentInstrumentsInstrumentsInner rebuild(
          void Function(RecentInstrumentsInstrumentsInnerBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  RecentInstrumentsInstrumentsInnerBuilder toBuilder() =>
      RecentInstrumentsInstrumentsInnerBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is RecentInstrumentsInstrumentsInner &&
        instrument == other.instrument &&
        lastAnalyzedAt == other.lastAnalyzedAt &&
        mode == other.mode;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, instrument.hashCode);
    _$hash = $jc(_$hash, lastAnalyzedAt.hashCode);
    _$hash = $jc(_$hash, mode.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'RecentInstrumentsInstrumentsInner')
          ..add('instrument', instrument)
          ..add('lastAnalyzedAt', lastAnalyzedAt)
          ..add('mode', mode))
        .toString();
  }
}

class RecentInstrumentsInstrumentsInnerBuilder
    implements
        Builder<RecentInstrumentsInstrumentsInner,
            RecentInstrumentsInstrumentsInnerBuilder> {
  _$RecentInstrumentsInstrumentsInner? _$v;

  String? _instrument;
  String? get instrument => _$this._instrument;
  set instrument(String? instrument) => _$this._instrument = instrument;

  DateTime? _lastAnalyzedAt;
  DateTime? get lastAnalyzedAt => _$this._lastAnalyzedAt;
  set lastAnalyzedAt(DateTime? lastAnalyzedAt) =>
      _$this._lastAnalyzedAt = lastAnalyzedAt;

  String? _mode;
  String? get mode => _$this._mode;
  set mode(String? mode) => _$this._mode = mode;

  RecentInstrumentsInstrumentsInnerBuilder() {
    RecentInstrumentsInstrumentsInner._defaults(this);
  }

  RecentInstrumentsInstrumentsInnerBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _instrument = $v.instrument;
      _lastAnalyzedAt = $v.lastAnalyzedAt;
      _mode = $v.mode;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(RecentInstrumentsInstrumentsInner other) {
    _$v = other as _$RecentInstrumentsInstrumentsInner;
  }

  @override
  void update(
      void Function(RecentInstrumentsInstrumentsInnerBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  RecentInstrumentsInstrumentsInner build() => _build();

  _$RecentInstrumentsInstrumentsInner _build() {
    final _$result = _$v ??
        _$RecentInstrumentsInstrumentsInner._(
          instrument: BuiltValueNullFieldError.checkNotNull(
              instrument, r'RecentInstrumentsInstrumentsInner', 'instrument'),
          lastAnalyzedAt: BuiltValueNullFieldError.checkNotNull(lastAnalyzedAt,
              r'RecentInstrumentsInstrumentsInner', 'lastAnalyzedAt'),
          mode: BuiltValueNullFieldError.checkNotNull(
              mode, r'RecentInstrumentsInstrumentsInner', 'mode'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
