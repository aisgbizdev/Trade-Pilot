// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'journal_sentiment.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$JournalSentiment extends JournalSentiment {
  @override
  final String instrument;
  @override
  final int windowDays;
  @override
  final int minSampleSize;
  @override
  final int minDistinctTraders;
  @override
  final int sampleSize;
  @override
  final int distinctTraders;
  @override
  final bool gated;
  @override
  final int buyPct;
  @override
  final int sellPct;

  factory _$JournalSentiment(
          [void Function(JournalSentimentBuilder)? updates]) =>
      (JournalSentimentBuilder()..update(updates))._build();

  _$JournalSentiment._(
      {required this.instrument,
      required this.windowDays,
      required this.minSampleSize,
      required this.minDistinctTraders,
      required this.sampleSize,
      required this.distinctTraders,
      required this.gated,
      required this.buyPct,
      required this.sellPct})
      : super._();
  @override
  JournalSentiment rebuild(void Function(JournalSentimentBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  JournalSentimentBuilder toBuilder() =>
      JournalSentimentBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is JournalSentiment &&
        instrument == other.instrument &&
        windowDays == other.windowDays &&
        minSampleSize == other.minSampleSize &&
        minDistinctTraders == other.minDistinctTraders &&
        sampleSize == other.sampleSize &&
        distinctTraders == other.distinctTraders &&
        gated == other.gated &&
        buyPct == other.buyPct &&
        sellPct == other.sellPct;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, instrument.hashCode);
    _$hash = $jc(_$hash, windowDays.hashCode);
    _$hash = $jc(_$hash, minSampleSize.hashCode);
    _$hash = $jc(_$hash, minDistinctTraders.hashCode);
    _$hash = $jc(_$hash, sampleSize.hashCode);
    _$hash = $jc(_$hash, distinctTraders.hashCode);
    _$hash = $jc(_$hash, gated.hashCode);
    _$hash = $jc(_$hash, buyPct.hashCode);
    _$hash = $jc(_$hash, sellPct.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'JournalSentiment')
          ..add('instrument', instrument)
          ..add('windowDays', windowDays)
          ..add('minSampleSize', minSampleSize)
          ..add('minDistinctTraders', minDistinctTraders)
          ..add('sampleSize', sampleSize)
          ..add('distinctTraders', distinctTraders)
          ..add('gated', gated)
          ..add('buyPct', buyPct)
          ..add('sellPct', sellPct))
        .toString();
  }
}

class JournalSentimentBuilder
    implements Builder<JournalSentiment, JournalSentimentBuilder> {
  _$JournalSentiment? _$v;

  String? _instrument;
  String? get instrument => _$this._instrument;
  set instrument(String? instrument) => _$this._instrument = instrument;

  int? _windowDays;
  int? get windowDays => _$this._windowDays;
  set windowDays(int? windowDays) => _$this._windowDays = windowDays;

  int? _minSampleSize;
  int? get minSampleSize => _$this._minSampleSize;
  set minSampleSize(int? minSampleSize) =>
      _$this._minSampleSize = minSampleSize;

  int? _minDistinctTraders;
  int? get minDistinctTraders => _$this._minDistinctTraders;
  set minDistinctTraders(int? minDistinctTraders) =>
      _$this._minDistinctTraders = minDistinctTraders;

  int? _sampleSize;
  int? get sampleSize => _$this._sampleSize;
  set sampleSize(int? sampleSize) => _$this._sampleSize = sampleSize;

  int? _distinctTraders;
  int? get distinctTraders => _$this._distinctTraders;
  set distinctTraders(int? distinctTraders) =>
      _$this._distinctTraders = distinctTraders;

  bool? _gated;
  bool? get gated => _$this._gated;
  set gated(bool? gated) => _$this._gated = gated;

  int? _buyPct;
  int? get buyPct => _$this._buyPct;
  set buyPct(int? buyPct) => _$this._buyPct = buyPct;

  int? _sellPct;
  int? get sellPct => _$this._sellPct;
  set sellPct(int? sellPct) => _$this._sellPct = sellPct;

  JournalSentimentBuilder() {
    JournalSentiment._defaults(this);
  }

  JournalSentimentBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _instrument = $v.instrument;
      _windowDays = $v.windowDays;
      _minSampleSize = $v.minSampleSize;
      _minDistinctTraders = $v.minDistinctTraders;
      _sampleSize = $v.sampleSize;
      _distinctTraders = $v.distinctTraders;
      _gated = $v.gated;
      _buyPct = $v.buyPct;
      _sellPct = $v.sellPct;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(JournalSentiment other) {
    _$v = other as _$JournalSentiment;
  }

  @override
  void update(void Function(JournalSentimentBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  JournalSentiment build() => _build();

  _$JournalSentiment _build() {
    final _$result = _$v ??
        _$JournalSentiment._(
          instrument: BuiltValueNullFieldError.checkNotNull(
              instrument, r'JournalSentiment', 'instrument'),
          windowDays: BuiltValueNullFieldError.checkNotNull(
              windowDays, r'JournalSentiment', 'windowDays'),
          minSampleSize: BuiltValueNullFieldError.checkNotNull(
              minSampleSize, r'JournalSentiment', 'minSampleSize'),
          minDistinctTraders: BuiltValueNullFieldError.checkNotNull(
              minDistinctTraders, r'JournalSentiment', 'minDistinctTraders'),
          sampleSize: BuiltValueNullFieldError.checkNotNull(
              sampleSize, r'JournalSentiment', 'sampleSize'),
          distinctTraders: BuiltValueNullFieldError.checkNotNull(
              distinctTraders, r'JournalSentiment', 'distinctTraders'),
          gated: BuiltValueNullFieldError.checkNotNull(
              gated, r'JournalSentiment', 'gated'),
          buyPct: BuiltValueNullFieldError.checkNotNull(
              buyPct, r'JournalSentiment', 'buyPct'),
          sellPct: BuiltValueNullFieldError.checkNotNull(
              sellPct, r'JournalSentiment', 'sellPct'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
