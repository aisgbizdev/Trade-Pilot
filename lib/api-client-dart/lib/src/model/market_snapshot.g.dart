// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'market_snapshot.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const MarketSnapshotSourceStatusEnum _$marketSnapshotSourceStatusEnum_fresh =
    const MarketSnapshotSourceStatusEnum._('fresh');
const MarketSnapshotSourceStatusEnum
    _$marketSnapshotSourceStatusEnum_staleSourceAge =
    const MarketSnapshotSourceStatusEnum._('staleSourceAge');
const MarketSnapshotSourceStatusEnum
    _$marketSnapshotSourceStatusEnum_staleFeedUnavailable =
    const MarketSnapshotSourceStatusEnum._('staleFeedUnavailable');
const MarketSnapshotSourceStatusEnum
    _$marketSnapshotSourceStatusEnum_feedUnavailable =
    const MarketSnapshotSourceStatusEnum._('feedUnavailable');

MarketSnapshotSourceStatusEnum _$marketSnapshotSourceStatusEnumValueOf(
    String name) {
  switch (name) {
    case 'fresh':
      return _$marketSnapshotSourceStatusEnum_fresh;
    case 'staleSourceAge':
      return _$marketSnapshotSourceStatusEnum_staleSourceAge;
    case 'staleFeedUnavailable':
      return _$marketSnapshotSourceStatusEnum_staleFeedUnavailable;
    case 'feedUnavailable':
      return _$marketSnapshotSourceStatusEnum_feedUnavailable;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<MarketSnapshotSourceStatusEnum>
    _$marketSnapshotSourceStatusEnumValues = BuiltSet<
        MarketSnapshotSourceStatusEnum>(const <MarketSnapshotSourceStatusEnum>[
  _$marketSnapshotSourceStatusEnum_fresh,
  _$marketSnapshotSourceStatusEnum_staleSourceAge,
  _$marketSnapshotSourceStatusEnum_staleFeedUnavailable,
  _$marketSnapshotSourceStatusEnum_feedUnavailable,
]);

Serializer<MarketSnapshotSourceStatusEnum>
    _$marketSnapshotSourceStatusEnumSerializer =
    _$MarketSnapshotSourceStatusEnumSerializer();

class _$MarketSnapshotSourceStatusEnumSerializer
    implements PrimitiveSerializer<MarketSnapshotSourceStatusEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'fresh': 'fresh',
    'staleSourceAge': 'stale_source_age',
    'staleFeedUnavailable': 'stale_feed_unavailable',
    'feedUnavailable': 'feed_unavailable',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'fresh': 'fresh',
    'stale_source_age': 'staleSourceAge',
    'stale_feed_unavailable': 'staleFeedUnavailable',
    'feed_unavailable': 'feedUnavailable',
  };

  @override
  final Iterable<Type> types = const <Type>[MarketSnapshotSourceStatusEnum];
  @override
  final String wireName = 'MarketSnapshotSourceStatusEnum';

  @override
  Object serialize(
          Serializers serializers, MarketSnapshotSourceStatusEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  MarketSnapshotSourceStatusEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      MarketSnapshotSourceStatusEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$MarketSnapshot extends MarketSnapshot {
  @override
  final String instrument;
  @override
  final String timeframe;
  @override
  final DateTime capturedAt;
  @override
  final DateTime sourceFetchedAt;
  @override
  final BuiltList<MarketSnapshotCandle> candles;
  @override
  final num priceAtAnalysis;
  @override
  final MarketSnapshotSourceStatusEnum sourceStatus;

  factory _$MarketSnapshot([void Function(MarketSnapshotBuilder)? updates]) =>
      (MarketSnapshotBuilder()..update(updates))._build();

  _$MarketSnapshot._(
      {required this.instrument,
      required this.timeframe,
      required this.capturedAt,
      required this.sourceFetchedAt,
      required this.candles,
      required this.priceAtAnalysis,
      required this.sourceStatus})
      : super._();
  @override
  MarketSnapshot rebuild(void Function(MarketSnapshotBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  MarketSnapshotBuilder toBuilder() => MarketSnapshotBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is MarketSnapshot &&
        instrument == other.instrument &&
        timeframe == other.timeframe &&
        capturedAt == other.capturedAt &&
        sourceFetchedAt == other.sourceFetchedAt &&
        candles == other.candles &&
        priceAtAnalysis == other.priceAtAnalysis &&
        sourceStatus == other.sourceStatus;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, instrument.hashCode);
    _$hash = $jc(_$hash, timeframe.hashCode);
    _$hash = $jc(_$hash, capturedAt.hashCode);
    _$hash = $jc(_$hash, sourceFetchedAt.hashCode);
    _$hash = $jc(_$hash, candles.hashCode);
    _$hash = $jc(_$hash, priceAtAnalysis.hashCode);
    _$hash = $jc(_$hash, sourceStatus.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'MarketSnapshot')
          ..add('instrument', instrument)
          ..add('timeframe', timeframe)
          ..add('capturedAt', capturedAt)
          ..add('sourceFetchedAt', sourceFetchedAt)
          ..add('candles', candles)
          ..add('priceAtAnalysis', priceAtAnalysis)
          ..add('sourceStatus', sourceStatus))
        .toString();
  }
}

class MarketSnapshotBuilder
    implements Builder<MarketSnapshot, MarketSnapshotBuilder> {
  _$MarketSnapshot? _$v;

  String? _instrument;
  String? get instrument => _$this._instrument;
  set instrument(String? instrument) => _$this._instrument = instrument;

  String? _timeframe;
  String? get timeframe => _$this._timeframe;
  set timeframe(String? timeframe) => _$this._timeframe = timeframe;

  DateTime? _capturedAt;
  DateTime? get capturedAt => _$this._capturedAt;
  set capturedAt(DateTime? capturedAt) => _$this._capturedAt = capturedAt;

  DateTime? _sourceFetchedAt;
  DateTime? get sourceFetchedAt => _$this._sourceFetchedAt;
  set sourceFetchedAt(DateTime? sourceFetchedAt) =>
      _$this._sourceFetchedAt = sourceFetchedAt;

  ListBuilder<MarketSnapshotCandle>? _candles;
  ListBuilder<MarketSnapshotCandle> get candles =>
      _$this._candles ??= ListBuilder<MarketSnapshotCandle>();
  set candles(ListBuilder<MarketSnapshotCandle>? candles) =>
      _$this._candles = candles;

  num? _priceAtAnalysis;
  num? get priceAtAnalysis => _$this._priceAtAnalysis;
  set priceAtAnalysis(num? priceAtAnalysis) =>
      _$this._priceAtAnalysis = priceAtAnalysis;

  MarketSnapshotSourceStatusEnum? _sourceStatus;
  MarketSnapshotSourceStatusEnum? get sourceStatus => _$this._sourceStatus;
  set sourceStatus(MarketSnapshotSourceStatusEnum? sourceStatus) =>
      _$this._sourceStatus = sourceStatus;

  MarketSnapshotBuilder() {
    MarketSnapshot._defaults(this);
  }

  MarketSnapshotBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _instrument = $v.instrument;
      _timeframe = $v.timeframe;
      _capturedAt = $v.capturedAt;
      _sourceFetchedAt = $v.sourceFetchedAt;
      _candles = $v.candles.toBuilder();
      _priceAtAnalysis = $v.priceAtAnalysis;
      _sourceStatus = $v.sourceStatus;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(MarketSnapshot other) {
    _$v = other as _$MarketSnapshot;
  }

  @override
  void update(void Function(MarketSnapshotBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  MarketSnapshot build() => _build();

  _$MarketSnapshot _build() {
    _$MarketSnapshot _$result;
    try {
      _$result = _$v ??
          _$MarketSnapshot._(
            instrument: BuiltValueNullFieldError.checkNotNull(
                instrument, r'MarketSnapshot', 'instrument'),
            timeframe: BuiltValueNullFieldError.checkNotNull(
                timeframe, r'MarketSnapshot', 'timeframe'),
            capturedAt: BuiltValueNullFieldError.checkNotNull(
                capturedAt, r'MarketSnapshot', 'capturedAt'),
            sourceFetchedAt: BuiltValueNullFieldError.checkNotNull(
                sourceFetchedAt, r'MarketSnapshot', 'sourceFetchedAt'),
            candles: candles.build(),
            priceAtAnalysis: BuiltValueNullFieldError.checkNotNull(
                priceAtAnalysis, r'MarketSnapshot', 'priceAtAnalysis'),
            sourceStatus: BuiltValueNullFieldError.checkNotNull(
                sourceStatus, r'MarketSnapshot', 'sourceStatus'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'candles';
        candles.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'MarketSnapshot', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
