// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'analytics_event_body.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const AnalyticsEventBodyEventTypeEnum
    _$analyticsEventBodyEventTypeEnum_pageView =
    const AnalyticsEventBodyEventTypeEnum._('pageView');
const AnalyticsEventBodyEventTypeEnum
    _$analyticsEventBodyEventTypeEnum_analysisCreated =
    const AnalyticsEventBodyEventTypeEnum._('analysisCreated');
const AnalyticsEventBodyEventTypeEnum
    _$analyticsEventBodyEventTypeEnum_tradeLogged =
    const AnalyticsEventBodyEventTypeEnum._('tradeLogged');
const AnalyticsEventBodyEventTypeEnum
    _$analyticsEventBodyEventTypeEnum_alertArmed =
    const AnalyticsEventBodyEventTypeEnum._('alertArmed');
const AnalyticsEventBodyEventTypeEnum
    _$analyticsEventBodyEventTypeEnum_feedbackSubmitted =
    const AnalyticsEventBodyEventTypeEnum._('feedbackSubmitted');

AnalyticsEventBodyEventTypeEnum _$analyticsEventBodyEventTypeEnumValueOf(
    String name) {
  switch (name) {
    case 'pageView':
      return _$analyticsEventBodyEventTypeEnum_pageView;
    case 'analysisCreated':
      return _$analyticsEventBodyEventTypeEnum_analysisCreated;
    case 'tradeLogged':
      return _$analyticsEventBodyEventTypeEnum_tradeLogged;
    case 'alertArmed':
      return _$analyticsEventBodyEventTypeEnum_alertArmed;
    case 'feedbackSubmitted':
      return _$analyticsEventBodyEventTypeEnum_feedbackSubmitted;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<AnalyticsEventBodyEventTypeEnum>
    _$analyticsEventBodyEventTypeEnumValues = BuiltSet<
        AnalyticsEventBodyEventTypeEnum>(const <AnalyticsEventBodyEventTypeEnum>[
  _$analyticsEventBodyEventTypeEnum_pageView,
  _$analyticsEventBodyEventTypeEnum_analysisCreated,
  _$analyticsEventBodyEventTypeEnum_tradeLogged,
  _$analyticsEventBodyEventTypeEnum_alertArmed,
  _$analyticsEventBodyEventTypeEnum_feedbackSubmitted,
]);

Serializer<AnalyticsEventBodyEventTypeEnum>
    _$analyticsEventBodyEventTypeEnumSerializer =
    _$AnalyticsEventBodyEventTypeEnumSerializer();

class _$AnalyticsEventBodyEventTypeEnumSerializer
    implements PrimitiveSerializer<AnalyticsEventBodyEventTypeEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'pageView': 'page_view',
    'analysisCreated': 'analysis_created',
    'tradeLogged': 'trade_logged',
    'alertArmed': 'alert_armed',
    'feedbackSubmitted': 'feedback_submitted',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'page_view': 'pageView',
    'analysis_created': 'analysisCreated',
    'trade_logged': 'tradeLogged',
    'alert_armed': 'alertArmed',
    'feedback_submitted': 'feedbackSubmitted',
  };

  @override
  final Iterable<Type> types = const <Type>[AnalyticsEventBodyEventTypeEnum];
  @override
  final String wireName = 'AnalyticsEventBodyEventTypeEnum';

  @override
  Object serialize(
          Serializers serializers, AnalyticsEventBodyEventTypeEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  AnalyticsEventBodyEventTypeEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      AnalyticsEventBodyEventTypeEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$AnalyticsEventBody extends AnalyticsEventBody {
  @override
  final AnalyticsEventBodyEventTypeEnum eventType;
  @override
  final String? path;
  @override
  final BuiltMap<String, JsonObject?>? metadata;

  factory _$AnalyticsEventBody(
          [void Function(AnalyticsEventBodyBuilder)? updates]) =>
      (AnalyticsEventBodyBuilder()..update(updates))._build();

  _$AnalyticsEventBody._({required this.eventType, this.path, this.metadata})
      : super._();
  @override
  AnalyticsEventBody rebuild(
          void Function(AnalyticsEventBodyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  AnalyticsEventBodyBuilder toBuilder() =>
      AnalyticsEventBodyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is AnalyticsEventBody &&
        eventType == other.eventType &&
        path == other.path &&
        metadata == other.metadata;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, eventType.hashCode);
    _$hash = $jc(_$hash, path.hashCode);
    _$hash = $jc(_$hash, metadata.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'AnalyticsEventBody')
          ..add('eventType', eventType)
          ..add('path', path)
          ..add('metadata', metadata))
        .toString();
  }
}

class AnalyticsEventBodyBuilder
    implements Builder<AnalyticsEventBody, AnalyticsEventBodyBuilder> {
  _$AnalyticsEventBody? _$v;

  AnalyticsEventBodyEventTypeEnum? _eventType;
  AnalyticsEventBodyEventTypeEnum? get eventType => _$this._eventType;
  set eventType(AnalyticsEventBodyEventTypeEnum? eventType) =>
      _$this._eventType = eventType;

  String? _path;
  String? get path => _$this._path;
  set path(String? path) => _$this._path = path;

  MapBuilder<String, JsonObject?>? _metadata;
  MapBuilder<String, JsonObject?> get metadata =>
      _$this._metadata ??= MapBuilder<String, JsonObject?>();
  set metadata(MapBuilder<String, JsonObject?>? metadata) =>
      _$this._metadata = metadata;

  AnalyticsEventBodyBuilder() {
    AnalyticsEventBody._defaults(this);
  }

  AnalyticsEventBodyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _eventType = $v.eventType;
      _path = $v.path;
      _metadata = $v.metadata?.toBuilder();
      _$v = null;
    }
    return this;
  }

  @override
  void replace(AnalyticsEventBody other) {
    _$v = other as _$AnalyticsEventBody;
  }

  @override
  void update(void Function(AnalyticsEventBodyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  AnalyticsEventBody build() => _build();

  _$AnalyticsEventBody _build() {
    _$AnalyticsEventBody _$result;
    try {
      _$result = _$v ??
          _$AnalyticsEventBody._(
            eventType: BuiltValueNullFieldError.checkNotNull(
                eventType, r'AnalyticsEventBody', 'eventType'),
            path: path,
            metadata: _metadata?.build(),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'metadata';
        _metadata?.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'AnalyticsEventBody', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
