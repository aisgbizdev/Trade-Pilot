// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_analysis_body.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const CreateAnalysisBodyTimeframeEnum _$createAnalysisBodyTimeframeEnum_n1m =
    const CreateAnalysisBodyTimeframeEnum._('n1m');
const CreateAnalysisBodyTimeframeEnum _$createAnalysisBodyTimeframeEnum_n5m =
    const CreateAnalysisBodyTimeframeEnum._('n5m');
const CreateAnalysisBodyTimeframeEnum _$createAnalysisBodyTimeframeEnum_n15m =
    const CreateAnalysisBodyTimeframeEnum._('n15m');
const CreateAnalysisBodyTimeframeEnum _$createAnalysisBodyTimeframeEnum_n30m =
    const CreateAnalysisBodyTimeframeEnum._('n30m');
const CreateAnalysisBodyTimeframeEnum _$createAnalysisBodyTimeframeEnum_n1h =
    const CreateAnalysisBodyTimeframeEnum._('n1h');
const CreateAnalysisBodyTimeframeEnum _$createAnalysisBodyTimeframeEnum_n4h =
    const CreateAnalysisBodyTimeframeEnum._('n4h');
const CreateAnalysisBodyTimeframeEnum _$createAnalysisBodyTimeframeEnum_n1d =
    const CreateAnalysisBodyTimeframeEnum._('n1d');
const CreateAnalysisBodyTimeframeEnum _$createAnalysisBodyTimeframeEnum_n1w =
    const CreateAnalysisBodyTimeframeEnum._('n1w');

CreateAnalysisBodyTimeframeEnum _$createAnalysisBodyTimeframeEnumValueOf(
    String name) {
  switch (name) {
    case 'n1m':
      return _$createAnalysisBodyTimeframeEnum_n1m;
    case 'n5m':
      return _$createAnalysisBodyTimeframeEnum_n5m;
    case 'n15m':
      return _$createAnalysisBodyTimeframeEnum_n15m;
    case 'n30m':
      return _$createAnalysisBodyTimeframeEnum_n30m;
    case 'n1h':
      return _$createAnalysisBodyTimeframeEnum_n1h;
    case 'n4h':
      return _$createAnalysisBodyTimeframeEnum_n4h;
    case 'n1d':
      return _$createAnalysisBodyTimeframeEnum_n1d;
    case 'n1w':
      return _$createAnalysisBodyTimeframeEnum_n1w;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<CreateAnalysisBodyTimeframeEnum>
    _$createAnalysisBodyTimeframeEnumValues = BuiltSet<
        CreateAnalysisBodyTimeframeEnum>(const <CreateAnalysisBodyTimeframeEnum>[
  _$createAnalysisBodyTimeframeEnum_n1m,
  _$createAnalysisBodyTimeframeEnum_n5m,
  _$createAnalysisBodyTimeframeEnum_n15m,
  _$createAnalysisBodyTimeframeEnum_n30m,
  _$createAnalysisBodyTimeframeEnum_n1h,
  _$createAnalysisBodyTimeframeEnum_n4h,
  _$createAnalysisBodyTimeframeEnum_n1d,
  _$createAnalysisBodyTimeframeEnum_n1w,
]);

const CreateAnalysisBodyModeEnum _$createAnalysisBodyModeEnum_beginner =
    const CreateAnalysisBodyModeEnum._('beginner');
const CreateAnalysisBodyModeEnum _$createAnalysisBodyModeEnum_pro =
    const CreateAnalysisBodyModeEnum._('pro');

CreateAnalysisBodyModeEnum _$createAnalysisBodyModeEnumValueOf(String name) {
  switch (name) {
    case 'beginner':
      return _$createAnalysisBodyModeEnum_beginner;
    case 'pro':
      return _$createAnalysisBodyModeEnum_pro;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<CreateAnalysisBodyModeEnum> _$createAnalysisBodyModeEnumValues =
    BuiltSet<CreateAnalysisBodyModeEnum>(const <CreateAnalysisBodyModeEnum>[
  _$createAnalysisBodyModeEnum_beginner,
  _$createAnalysisBodyModeEnum_pro,
]);

Serializer<CreateAnalysisBodyTimeframeEnum>
    _$createAnalysisBodyTimeframeEnumSerializer =
    _$CreateAnalysisBodyTimeframeEnumSerializer();
Serializer<CreateAnalysisBodyModeEnum> _$createAnalysisBodyModeEnumSerializer =
    _$CreateAnalysisBodyModeEnumSerializer();

class _$CreateAnalysisBodyTimeframeEnumSerializer
    implements PrimitiveSerializer<CreateAnalysisBodyTimeframeEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'n1m': '1m',
    'n5m': '5m',
    'n15m': '15m',
    'n30m': '30m',
    'n1h': '1h',
    'n4h': '4h',
    'n1d': '1D',
    'n1w': '1W',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    '1m': 'n1m',
    '5m': 'n5m',
    '15m': 'n15m',
    '30m': 'n30m',
    '1h': 'n1h',
    '4h': 'n4h',
    '1D': 'n1d',
    '1W': 'n1w',
  };

  @override
  final Iterable<Type> types = const <Type>[CreateAnalysisBodyTimeframeEnum];
  @override
  final String wireName = 'CreateAnalysisBodyTimeframeEnum';

  @override
  Object serialize(
          Serializers serializers, CreateAnalysisBodyTimeframeEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  CreateAnalysisBodyTimeframeEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      CreateAnalysisBodyTimeframeEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$CreateAnalysisBodyModeEnumSerializer
    implements PrimitiveSerializer<CreateAnalysisBodyModeEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'beginner': 'beginner',
    'pro': 'pro',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'beginner': 'beginner',
    'pro': 'pro',
  };

  @override
  final Iterable<Type> types = const <Type>[CreateAnalysisBodyModeEnum];
  @override
  final String wireName = 'CreateAnalysisBodyModeEnum';

  @override
  Object serialize(Serializers serializers, CreateAnalysisBodyModeEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  CreateAnalysisBodyModeEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      CreateAnalysisBodyModeEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$CreateAnalysisBody extends CreateAnalysisBody {
  @override
  final String instrument;
  @override
  final CreateAnalysisBodyTimeframeEnum timeframe;
  @override
  final String? userInputContext;
  @override
  final CreateAnalysisBodyModeEnum mode;

  factory _$CreateAnalysisBody(
          [void Function(CreateAnalysisBodyBuilder)? updates]) =>
      (CreateAnalysisBodyBuilder()..update(updates))._build();

  _$CreateAnalysisBody._(
      {required this.instrument,
      required this.timeframe,
      this.userInputContext,
      required this.mode})
      : super._();
  @override
  CreateAnalysisBody rebuild(
          void Function(CreateAnalysisBodyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  CreateAnalysisBodyBuilder toBuilder() =>
      CreateAnalysisBodyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is CreateAnalysisBody &&
        instrument == other.instrument &&
        timeframe == other.timeframe &&
        userInputContext == other.userInputContext &&
        mode == other.mode;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, instrument.hashCode);
    _$hash = $jc(_$hash, timeframe.hashCode);
    _$hash = $jc(_$hash, userInputContext.hashCode);
    _$hash = $jc(_$hash, mode.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'CreateAnalysisBody')
          ..add('instrument', instrument)
          ..add('timeframe', timeframe)
          ..add('userInputContext', userInputContext)
          ..add('mode', mode))
        .toString();
  }
}

class CreateAnalysisBodyBuilder
    implements Builder<CreateAnalysisBody, CreateAnalysisBodyBuilder> {
  _$CreateAnalysisBody? _$v;

  String? _instrument;
  String? get instrument => _$this._instrument;
  set instrument(String? instrument) => _$this._instrument = instrument;

  CreateAnalysisBodyTimeframeEnum? _timeframe;
  CreateAnalysisBodyTimeframeEnum? get timeframe => _$this._timeframe;
  set timeframe(CreateAnalysisBodyTimeframeEnum? timeframe) =>
      _$this._timeframe = timeframe;

  String? _userInputContext;
  String? get userInputContext => _$this._userInputContext;
  set userInputContext(String? userInputContext) =>
      _$this._userInputContext = userInputContext;

  CreateAnalysisBodyModeEnum? _mode;
  CreateAnalysisBodyModeEnum? get mode => _$this._mode;
  set mode(CreateAnalysisBodyModeEnum? mode) => _$this._mode = mode;

  CreateAnalysisBodyBuilder() {
    CreateAnalysisBody._defaults(this);
  }

  CreateAnalysisBodyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _instrument = $v.instrument;
      _timeframe = $v.timeframe;
      _userInputContext = $v.userInputContext;
      _mode = $v.mode;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(CreateAnalysisBody other) {
    _$v = other as _$CreateAnalysisBody;
  }

  @override
  void update(void Function(CreateAnalysisBodyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  CreateAnalysisBody build() => _build();

  _$CreateAnalysisBody _build() {
    final _$result = _$v ??
        _$CreateAnalysisBody._(
          instrument: BuiltValueNullFieldError.checkNotNull(
              instrument, r'CreateAnalysisBody', 'instrument'),
          timeframe: BuiltValueNullFieldError.checkNotNull(
              timeframe, r'CreateAnalysisBody', 'timeframe'),
          userInputContext: userInputContext,
          mode: BuiltValueNullFieldError.checkNotNull(
              mode, r'CreateAnalysisBody', 'mode'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
