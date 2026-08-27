// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'trader_mirror_response.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

class _$TraderMirrorResponse extends TraderMirrorResponse {
  @override
  final TraderMirrorInsights insights;
  @override
  final BuiltList<TraderMirrorHighlight> highlights;
  @override
  final String timezone;

  factory _$TraderMirrorResponse(
          [void Function(TraderMirrorResponseBuilder)? updates]) =>
      (TraderMirrorResponseBuilder()..update(updates))._build();

  _$TraderMirrorResponse._(
      {required this.insights,
      required this.highlights,
      required this.timezone})
      : super._();
  @override
  TraderMirrorResponse rebuild(
          void Function(TraderMirrorResponseBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  TraderMirrorResponseBuilder toBuilder() =>
      TraderMirrorResponseBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is TraderMirrorResponse &&
        insights == other.insights &&
        highlights == other.highlights &&
        timezone == other.timezone;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, insights.hashCode);
    _$hash = $jc(_$hash, highlights.hashCode);
    _$hash = $jc(_$hash, timezone.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'TraderMirrorResponse')
          ..add('insights', insights)
          ..add('highlights', highlights)
          ..add('timezone', timezone))
        .toString();
  }
}

class TraderMirrorResponseBuilder
    implements Builder<TraderMirrorResponse, TraderMirrorResponseBuilder> {
  _$TraderMirrorResponse? _$v;

  TraderMirrorInsightsBuilder? _insights;
  TraderMirrorInsightsBuilder get insights =>
      _$this._insights ??= TraderMirrorInsightsBuilder();
  set insights(TraderMirrorInsightsBuilder? insights) =>
      _$this._insights = insights;

  ListBuilder<TraderMirrorHighlight>? _highlights;
  ListBuilder<TraderMirrorHighlight> get highlights =>
      _$this._highlights ??= ListBuilder<TraderMirrorHighlight>();
  set highlights(ListBuilder<TraderMirrorHighlight>? highlights) =>
      _$this._highlights = highlights;

  String? _timezone;
  String? get timezone => _$this._timezone;
  set timezone(String? timezone) => _$this._timezone = timezone;

  TraderMirrorResponseBuilder() {
    TraderMirrorResponse._defaults(this);
  }

  TraderMirrorResponseBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _insights = $v.insights.toBuilder();
      _highlights = $v.highlights.toBuilder();
      _timezone = $v.timezone;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(TraderMirrorResponse other) {
    _$v = other as _$TraderMirrorResponse;
  }

  @override
  void update(void Function(TraderMirrorResponseBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  TraderMirrorResponse build() => _build();

  _$TraderMirrorResponse _build() {
    _$TraderMirrorResponse _$result;
    try {
      _$result = _$v ??
          _$TraderMirrorResponse._(
            insights: insights.build(),
            highlights: highlights.build(),
            timezone: BuiltValueNullFieldError.checkNotNull(
                timezone, r'TraderMirrorResponse', 'timezone'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'insights';
        insights.build();
        _$failedField = 'highlights';
        highlights.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'TraderMirrorResponse', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
